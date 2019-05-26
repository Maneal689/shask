const dbUtils = require("../../utils/dbUtils");
const jwtUtils = require("../../utils/jwtUtils");
const db = dbUtils.db;

async function config(req, res) {
  let userId = jwtUtils.getUserId(req);
  let taskId = req.body.id_task;
  if (userId) {
    let result = await db.query(
      "SELECT id_project, state FROM Tasks WHERE id_task=$1",
      [taskId]
    );
    if (result.rowCount > 0) {
      let row = result.rows[0];
      let projectId = row.id_project;
      if (await dbUtils.isProjectToUser(projectId, userId)) {
        db.query(
          "UPDATE Tasks SET title=$1, description=$2, state=$3, priority=$4, difficulty=$5 WHERE id_task=$6",
          [
            req.body.title,
            req.body.description,
            req.body.state,
            req.body.priority,
            req.body.difficulty,
            taskId,
          ]
        );
        res.status(200).json({ status: "OK" });
      } else
        res.status(400).json({
          status: "ERROR",
          desc: "Project not owned",
        });
    } else res.status(400).json({ status: "ERROR", desc: "Task not found" });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

async function remove(req, res) {
  let taskId = req.params.id;
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    let { rows } = await db.query(
      "SELECT id_project, id_user FROM Tasks WHERE id_task=$1",
      [taskId]
    );
    let task = rows.length > 0 ? rows[0] : undefined;
    if (task && task.id_user === userId) {
      db.query("DELETE FROM Tasks WHERE id_task=$1", [taskId]);
      res.status(200).json({ status: "OK" });
    } else res.status(400).json({ status: "ERROR", desc: "Task not found" });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

async function vote(req, res, val) {
  let taskId = req.params.id;
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    let { rows } = await db.query(
      "SELECT id_project FROM Tasks WHERE id_task=$1",
      [taskId]
    );
    let row = rows.length > 0 ? rows[0] : undefined;
    if (row) {
      if (await dbUtils.isProjectToUser(row.id_project, userId)) {
        let cVote = await db.query(
          "SELECT * FROM vote WHERE id_task=$1 AND id_user=$2",
          [taskId, userId]
        );
        if (cVote.rowCount > 0) {
          if (cVote.rows[0].val != val)
            db.query("UPDATE vote SET val=$1 WHERE id_task=$2 AND id_user=$3", [
              val,
              taskId,
              userId,
            ]);
        } else
          db.query(
            "INSERT INTO vote(id_task, id_user, val) VALUES($1, $2, $3)",
            [taskId, userId, val]
          );
        res.status(200).json({ status: "OK" });
      } else
        res.status(400).json({
          status: "ERROR",
          desc: "Project not owned",
        });
    } else res.status(400).json({ status: "ERROR", desc: "Task not found" });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

async function addSimple(req, res) {
  let userId = jwtUtils.getUserId(req);
  let taskId = req.body.id_task;
  if (userId) {
    let result = await db.query(
      "SELECT id_project FROM Tasks WHERE id_task=$1",
      [taskId]
    );
    if (result.rowCount > 0) {
      let row = result.rows[0];
      let projectId = row.id_project;
      if (await dbUtils.isProjectToUser(projectId, userId)) {
        let insRes = await db.query(
          "INSERT INTO simple_tasks (description, id_task, state) VALUES($1, $2, 0) RETURNING id_simple_task",
          [req.body.description, taskId]
        );
        if (insRes.rows && insRes.rows.length > 0) {
          res.status(200).json({
            status: "OK",
            id_simple_task: insRes.rows[0]["id_simple_task"],
          });
        }
      } else res.status(400).json({ status: "ERROR", desc: "Project not own" });
    } else res.status(400).json({ status: "ERROR", desc: "Task not found" });
  } else
    res.status(400).json({ status: "ERROR", desc: "Authentication failed" });
}

async function removeSimple(req, res) {
  let userId = jwtUtils.getUserId(req);
  let id_simple_task = req.params.id;
  var { rows } = await db.query(
    "SELECT id_task FROM simple_tasks WHERE id_simple_task = $1",
    [id_simple_task]
  );
  if (rows && rows.length > 0) {
    let taskId = rows[0]["id_task"];
    if (userId) {
      let result = await db.query(
        "SELECT id_project FROM Tasks WHERE id_task=$1",
        [taskId]
      );
      if (result.rowCount > 0) {
        let row = result.rows[0];
        let projectId = row.id_project;
        if (await dbUtils.isProjectToUser(projectId, userId)) {
          db.query("DELETE FROM simple_tasks WHERE id_simple_task=$1", [
            req.params.id,
          ]);
          res.status(200).json({ status: "OK" });
        } else
          res.status(400).json({ status: "ERROR", desc: "Project not own" });
      } else res.status(400).json({ status: "ERROR", desc: "Task not found" });
    } else
      res.status(400).json({ status: "ERROR", desc: "Authentication failed" });
  } else
    res.status(400).json({ status: "ERROR", desc: "Simple task not found" });
}

async function changeSimple(req, res) {
  let userId = jwtUtils.getUserId(req);
  let id_simple_task = req.params.id;
  var { rows } = await db.query(
    "SELECT state, id_task FROM simple_tasks WHERE id_simple_task = $1",
    [id_simple_task]
  );
  if (rows && rows.length > 0) {
    let taskId = rows[0]["id_task"];
    let state = parseInt(rows[0]["state"]);
    if (userId) {
      let result = await db.query(
        "SELECT id_project FROM Tasks WHERE id_task=$1",
        [taskId]
      );
      if (result.rowCount > 0) {
        let row = result.rows[0];
        let projectId = row.id_project;
        if (await dbUtils.isProjectToUser(projectId, userId)) {
          state = (state + 1) % 2;
          db.query("UPDATE simple_tasks SET state=$1 WHERE id_simple_task=$2", [
            state,
            id_simple_task,
          ]);
          res.status(200).json({ status: "OK" });
        } else
          res.status(400).json({ status: "ERROR", desc: "Project not own" });
      } else res.status(400).json({ status: "ERROR", desc: "Task not found" });
    } else
      res.status(400).json({ status: "ERROR", desc: "Authentication failed" });
  } else
    res.status(400).json({ status: "ERROR", desc: "Simple task not found" });
}

module.exports = {
  config,
  remove,
  vote,
  addSimple,
  removeSimple,
  changeSimple,
};
