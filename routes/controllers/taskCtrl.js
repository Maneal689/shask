const dbUtils = require('../../utils/dbUtils');
const jwtUtils = require('../../utils/jwtUtils');
const db = dbUtils.db;

async function config(req, res) {
    let userId = jwtUtils.getUserId(req);
    let taskId = req.body.id_task;
    if (userId) {
        let result = await db.query(
            'SELECT id_project, state FROM Tasks WHERE id_task=$1',
            [taskId]
        );
        if (result.rowCount > 0) {
            let row = result.rows[0];
            let projectId = row.id_project;
            if (await dbUtils.isProjectToUser(projectId, userId)) {
                db.query(
                    'UPDATE Tasks SET title=$1, description=$2, state=$3, priority=$4, difficulty=$5 WHERE id_task=$6',
                    [
                        req.body.title,
                        req.body.description,
                        req.body.state,
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
            'SELECT id_project FROM Tasks WHERE id_task=$1',
            [taskId]
        );
        let row = rows.length > 0 ? rows[0] : undefined;
        if (row) {
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
module.exports = { config, remove };
