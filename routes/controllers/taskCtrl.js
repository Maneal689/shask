const dbUtils = require('../../utils/dbUtils');
const jwtUtils = require('../../utils/jwtUtils');
const db = dbUtils.db;

async function toggleChecked(req, res) {
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        let { rows } = await db.query(
            'SELECT id_project, checked FROM Tasks WHERE id_task=$1',
            [req.params.id]
        );
        let row = rows.length > 0 ? rows[0] : undefined;
        let checked = row.checked;
        if (await dbUtils.isProjectToUser(row.id_project, userId)) {
            db.query('UPDATE Tasks SET checked=$1 WHERE id_task=$2', [
                checked === 1 ? 0 : 1,
                req.params.id,
            ]);
            res.status(200).json({ status: 'OK' });
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

async function config(req, res) {
    let userId = jwtUtils.getUserId(req);
    let taskId = req.body.id_task;
    if (userId) {
        let result = await db.query(
            'SELECT id_project, checked FROM Tasks WHERE id_task=$1',
            [taskId]
        );
        if (result.rowCount > 0) {
            let row = result.rows[0];
            let projectId = row.id_project;
            let checked = row.checked;
            if (await dbUtils.isProjectToUser(projectId, userId)) {
                db.query(
                    'UPDATE Tasks SET description=$1, checked=$2, section=$3, priority=$4, difficulty=$5 WHERE id_task=$6',
                    [
                        req.body.description,
                        checked,
                        req.body.section,
                        req.body.priority,
                        req.body.difficulty,
                        taskId,
                    ]
                );
                res.status(200).json({ status: 'OK' });
            } else
                res.status(400).json({
                    status: 'ERROR',
                    desc: 'Project not owned',
                });
        } else
            res.status(400).json({ status: 'ERROR', desc: 'Task not found' });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed',
        });
}

async function remove(req, res) {
    let taskId = req.params.id;
    let userId = jwtUtils.getUserId(req);
    if (userId) {
        let { rows } = await db.query(
            'SELECT id_project, checked FROM Tasks WHERE id_task=$1',
            [req.params.id]
        );
        let row = rows.length > 0 ? rows[0] : undefined;
        if (row) {
            let checked = row.checked;
            if (await dbUtils.isProjectToUser(row.id_project, userId)) {
                db.query('DELETE FROM Tasks WHERE id_task=$1', [taskId]);
                res.status(200).json({ status: 'OK' });
            } else
                res.status(400).json({
                    status: 'ERROR',
                    desc: 'Project not owned',
                });
        } else
            res.status(400).json({ status: 'ERROR', desc: 'Task not found' });
    } else
        res.status(400).json({
            status: 'ERROR',
            desc: 'Authentication failed',
        });
}
module.exports = { toggleChecked, config, remove };
