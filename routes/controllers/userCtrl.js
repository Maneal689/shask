const bcrypt = require('bcrypt');

const dbUtils = require('../../utils/dbUtils');
const jwtUtils = require('../../utils/jwtUtils');
const db = dbUtils.db;

async function register(req, res) {
    let emailRegex = /^[a-zA-Z0-9\.\-_]+@[a-zA-Z0-9\-\.]{2,10}?\.[a-zA-Z]{2,6}$/;
    let usernameRegex = /^[a-zA-Z0-9\.\-_]{3,}$/;
    let passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9@#$%^&+=*.\-_]){6,}$/;
    let errReport = [];

    if (!req.body.email || req.body.email.length === 0)
        errReport.push({ desc: 'Missing', item: 'email' });
    else if (!emailRegex.test(req.body.email))
        errReport.push({ item: 'email', desc: 'Invalid' });
    else {
        let res = await db.query('SELECT * FROM Users WHERE email=$1', [
            req.body.email,
        ]);
        if (res.rowCount > 0)
            errReport.push({ item: 'email', desc: 'Already' });
    }

    if (!req.body.username || req.body.username.length === 0)
        errReport.push({ desc: 'Missing', item: 'username' });
    else if (!usernameRegex.test(req.body.username))
        errReport.push({ item: 'username', desc: 'Invalid' });
    else {
        let res = await db.query('SELECT * FROM Users WHERE username=$1', [
            req.body.username,
        ]);
        if (res.rowCount > 0)
            errReport.push({ item: 'username', desc: 'Already' });
    }

    if (!req.body.password || req.body.password.length === 0)
        errReport.push({ desc: 'Missing', item: 'password' });
    else if (!passwordRegex.test(req.body.password))
        errReport.push({ item: 'password', desc: 'Invalid' });

    if (errReport.length > 0)
        res.status(400).json({
            status: 'REGISTER_ERROR',
            errList: errReport,
        });
    else {
        bcrypt.hash(req.body.password, 10).then(hash => {
            db.query(
                'INSERT INTO Users(username, email, password) VALUES($1, $2, $3)',
                [req.body.username, req.body.email, hash]
            )
                .then((error, rows) => res.status(200).json({ status: 'OK' }))
                .catch(error => console.error(error));
        });
    }
}

async function login(req, res) {
    let user = await db.query(
        'SELECT id_user, password FROM Users WHERE username=$1',
        [req.body.username]
    );
    user = user.rowCount === 1 ? user.rows[0] : undefined;
    if (!user) {
        user = await db.query(
            'SELECT id_user, password FROM Users WHERE email=$1',
            [req.body.username]
        );
        user = user.rowCount === 1 ? user.rows[0] : undefined;
    }
    if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                let jwtToken = jwtUtils.createUserToken(user);
                req.session.accessToken = jwtToken;
                res.status(200).json({ status: 'OK' });
            } else
                res.status(400).json({
                    status: 'LOGIN_ERROR',
                    item: 'password',
                    desc: 'Invalid password',
                });
        });
    } else
        res.status(400).json({
            status: 'LOGIN_ERROR',
            item: 'username',
            desc: 'Unknown username/email',
        });
}

async function logged(req, res) {
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        let username = undefined;
        let { rows } = await db.query(
            'SELECT username FROM Users where id_user=$1',
            [userId]
        );
        if (rows && rows.length > 0) username = rows[0].username;
        res.status(200).json({
            status: 'OK',
            userInfo: { myId: userId, username },
        });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'MISSING OR INVALID TOKEN',
        });
}

function logout(req, res) {
    req.session.accessToken = null;
    res.status(200).json({ status: 'OK' });
}

async function me(req, res) {
    let userId = jwtUtils.getUserId(req);

    if (userId) {
        let user = await db.query(
            'SELECT id_user, username, email, image_url, admin FROM Users WHERE id_user=$1',
            [userId]
        );
        user = user.rowCount === 1 ? user.rows[0] : undefined;
        if (user) {
            let infos = {
                me: user,
                projectsIdList: [],
            };
            let projectResult = await db.query(
                'SELECT id_project FROM Own WHERE id_user=$1',
                [userId]
            );
            infos.projectsIdList = projectResult.rows.map(
                elm => elm.id_project
            );
            res.status(200).json({
                status: 'OK',
                infos,
            });
        } else {
            res.status(400).json({ status: 'ERROR', desc: 'Unknown user' });
        }
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'MISSING OR INVALID TOKEN',
        });
}

async function getInfoOf(req, res) {
    let requestId = req.params.id;
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        let user = await db.query(
            'SELECT id_user, username, email, image_url, admin FROM Users WHERE id_user=$1',
            [userId]
        );
        user = user.rowCount === 1 ? user.rows[0] : undefined;
        if (user) res.status(200).json({ status: 'OK', info: user });
        else
            res.status(400).json({
                status: 'ERROR',
                desc: 'User not found',
            });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed',
        });
}

async function search(req, res) {
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        let q = req.body.query;
        q = q.toLowerCase();
        let userList = [];
        let { rows } = await db.query(
            `SELECT id_user, username FROM Users WHERE LOWER(username) LIKE '%${q}%' LIMIT 10`
        );
        if (rows) rows.forEach(user => userList.push(user));
        res.status(200).json({ status: 'OK', userList });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed',
        });
}

module.exports = { logged, register, login, me, logout, getInfoOf, search };
