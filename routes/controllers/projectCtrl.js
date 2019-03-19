const bcrypt = require('bcrypt');

const dbUtils = require('../../utils/dbUtils');
const jwtUtils = require('../../utils/jwtUtils');
const db = dbUtils.db;

async function collaborators(req, res) {
    let projectId = req.params.id;
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        if (await dbUtils.isProjectToUser(projectId, userId)) {
            let { rows } = await db.query(
                'SELECT Users.id_user, username, image_url FROM Own, Users WHERE Users.id_user = Own.id_user AND id_project=$1',
                [projectId]
            );
            collaboratorsList = rows;
            res.status(200).json({ status: 'OK', collaboratorsList });
        } else
            res.status(400).json({
                status: 'ERROR',
                desc: 'Project not owned',
            });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed',
        });
}

async function allInfos(req, res) {
    let projectId = req.params.id;
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        if (await dbUtils.isProjectToUser(projectId, userId)) {
            let infos = {};

            let res1 = await db.query(
                'SELECT * FROM Projects WHERE id_project=$1',
                [projectId]
            );

            if (res1.rowCount > 0) {
                let { id_project, description, title } = res1.rows[0];
                infos.id_project = id_project;
                infos.description = description;
                infos.title = title;
                var { rows } = await db.query(
                    'SELECT * FROM Tasks WHERE id_project=$1',
                    [projectId]
                );
                infos.tasksList = rows;
                var { rows } = await db.query(
                    'SELECT Users.id_user, username, image_url FROM Own, Users WHERE Users.id_user = Own.id_user AND id_project=$1',
                    [projectId]
                );
                infos.collaboratorsList = rows;
                res.status(200).json({
                    status: 'OK',
                    infos,
                });
            } else
                res.status(400).json({
                    status: 'ERROR',
                    desc: 'Project not owned',
                });
        } else
            res.status(400).json({
                status: 'ERROR',
                desc: 'Project not owned',
            });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed',
        });
}

async function create(req, res) {
    let userId = jwtUtils.getUserId(req);
    let projectTitle = req.body.title;
    let titleRgx = /^[a-zA-Z0-9@\-\._\ ]{1,}$/;
    if (userId && projectTitle && titleRgx.test(projectTitle)) {
        let response = await db.query(
            'INSERT INTO Projects (title) VALUES ($1) RETURNING id_project',
            [projectTitle]
        );
        let lastId = response.rows[0].id_project;
        db.query('INSERT INTO Own (id_user, id_project) VALUES ($1, $2)', [
            userId,
            lastId,
        ]);
        res.status(200).json({
            status: 'OK',
            id_project: lastId,
        });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed or project title not valid',
        });
}

async function addTask(req, res) {
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        let projectId = req.params.id;
        if (await dbUtils.isProjectToUser(projectId, userId)) {
            let { description, priority, difficulty, section } = req.body;
            db.run(
                'INSERT INTO Tasks(description, checked, priority, difficulty, id_project, section) VALUES($1, $2, $3, $4, $5, $6)',
                [description, 0, priority, difficulty, projectId, section]
            );
        } else
            res.status(400).json({
                status: 'ERROR',
                desc: 'Project not owned',
            });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed',
        });
}

async function addCollaborator(req, res) {
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        let projectId = req.params.id;
        if (await dbUtils.isProjectToUser(projectId, userId)) {
            let username = req.body.username;
            let { rows } = await db.query(
                'SELECT id_user FROM Users WHERE username=$1',
                [username]
            );
            if (rows.length > 0) {
                let row = rows[0];
                let resultQuery = await db.query(
                    'SELECT id_user, id_project FROM Own WHERE id_user=$1 AND id_project=$2',
                    [row.id_user, projectId]
                );
                let row2 =
                    resultQuery.rowCount > 0 ? resultQuery.rows[0] : undefined;
                if (!row2) {
                    db.query(
                        'INSERT INTO Own(id_user, id_project) VALUES ($1, $2)',
                        [row.id_user, projectId]
                    );
                    res.status(200).json({
                        status: 'OK',
                    });
                }
            }
        } else
            res.status(400).json({
                status: 'ERROR',
                desc: 'Project not owned',
            });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed',
        });
}

module.exports = { collaborators, allInfos, create, addTask, addCollaborator };
