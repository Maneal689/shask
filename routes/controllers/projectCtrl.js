const bcrypt = require("bcrypt");

const dbUtils = require("../../utils/dbUtils");
const jwtUtils = require("../../utils/jwtUtils");
const db = dbUtils.db;

async function collaborators(req, res) {
  let projectId = req.params.id;
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    if (await dbUtils.isProjectToUser(projectId, userId)) {
      let { rows } = await db.query(
        "SELECT Users.id_user, username, image_url FROM Own, Users WHERE Users.id_user = Own.id_user AND id_project=$1",
        [projectId]
      );
      collaboratorsList = rows;
      res.status(200).json({ status: "OK", collaboratorsList });
    } else
      res.status(400).json({
        status: "ERROR",
        desc: "Project not owned",
      });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

async function allInfos(req, res) {
  let projectId = req.params.id;
  let userId = jwtUtils.getUserId(req);
  let infos = {};
  let isPtU = await dbUtils.isProjectToUser(projectId, userId);
  infos.creator = isPtU.creator;
  if (userId) {
    if (isPtU) {
      let res1 = await db.query("SELECT * FROM Projects WHERE id_project=$1", [
        projectId,
      ]);

      if (res1.rowCount > 0) {
        let { id_project, description, title } = res1.rows[0];
        infos.id_project = id_project;
        infos.description = description;
        infos.title = title;
        var { rows } = await db.query(
          "SELECT id_task, title, description, state, priority, difficulty, tasks.id_user, username FROM tasks NATURAL JOIN users WHERE id_project=$1",
          [projectId]
        );
        for (let task of rows) {
          //SIMPLE TASKS
          let simpleTasks = await db.query(
            "SELECT * FROM simple_tasks WHERE id_task = $1",
            [task.id_task]
          );
          task.simpleTasks = simpleTasks.rows;
          //VOTES COUNTING
          let voteCount = 0;
          let myVote = 0;
          let votes = await db.query(
            "SELECT id_user, val FROM vote WHERE id_task=$1",
            [task.id_task]
          );
          let totalVote = votes.rowCount;
          if (votes.rows && votes.rowCount > 0) {
            for (let vote of votes.rows) {
              voteCount += vote.val;
              if (vote.id_user === userId) myVote = vote.val;
            }
          }
          task.voteCount = voteCount;
          task.myVote = myVote;
          task.totalVote = totalVote;
        }
        infos.tasksList = rows;
        var { rows } = await db.query(
          "SELECT Users.id_user, username, image_url FROM Own, Users WHERE Users.id_user = Own.id_user AND id_project=$1",
          [projectId]
        );
        infos.collaboratorsList = rows;
        res.status(200).json({
          status: "OK",
          infos,
        });
      }
    } else
      res.status(400).json({
        status: "ERROR",
        desc: "Project not owned",
      });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

async function create(req, res) {
  let userId = jwtUtils.getUserId(req);
  let projectTitle = req.body.title;
  if (userId && projectTitle && projectTitle.length > 0) {
    let lastId = undefined;
    let result = await db.query(
      "INSERT INTO Projects (title) VALUES ($1) RETURNING id_project",
      [projectTitle]
    );
    if (result.rows && result.rows.length > 0) {
      lastId = result.rows[0]["id_project"];
      db.query(
        "INSERT INTO Own (id_user, id_project, creator) VALUES ($1, $2, $3)",
        [userId, lastId, 1]
      );
      res.status(200).json({
        status: "OK",
        id_project: lastId,
      });
    } else
      res.status(400).json({
        status: "ERROR",
        desc: "Error while insert new project",
      });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed or project title not valid",
    });
}

async function addTask(req, res) {
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    let projectId = req.params.id;
    if (await dbUtils.isProjectToUser(projectId, userId)) {
      let { title, description, state, priority, difficulty } = req.body;
      let lastId = undefined;
      let result = await db.query(
        "INSERT INTO Tasks(title, description, state, priority, difficulty, id_project, id_user) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_task",
        [title, description, state, priority, difficulty, projectId, userId]
      );
      if (result.rows && result.rows.length > 0) {
        lastId = result.rows[0]["id_task"];
        res.status(200).json({
          status: "OK",
          id_task: lastId,
        });
      } else
        res.status(400).json({
          status: "ERROR",
          desc: "Error while insert",
        });
    } else
      res.status(400).json({
        status: "ERROR",
        desc: "Project not owned",
      });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

async function addCollaborator(req, res) {
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    let projectId = req.params.id;
    let projectToUserResponse = await dbUtils.isProjectToUser(
      projectId,
      userId
    );
    if (projectToUserResponse && projectToUserResponse.creator === 1) {
      let username = req.body.username;
      let { rows } = await db.query(
        "SELECT id_user, username, image_url FROM Users WHERE username=$1",
        [username]
      );
      if (rows.length > 0) {
        let row = rows[0];
        //Verify if collaborator isn't already added
        let resultQuery = await db.query(
          "SELECT * FROM Own WHERE id_user=$1 AND id_project=$2",
          [row.id_user, projectId]
        );
        if (!resultQuery.rowCount || resultQuery.rowCount <= 0) {
          db.query("INSERT INTO Own(id_user, id_project) VALUES ($1, $2)", [
            row.id_user,
            projectId,
          ]);
          res.status(200).json({
            status: "OK",
            userInfo: row,
          });
        }
      }
    } else
      res.status(400).json({
        status: "ERROR",
        desc: "Project not owned or you'r not the creator",
      });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

async function removeCollaborator(req, res) {
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    let id_user = req.query.id;
    let id_project = req.params.id;
    let projectToUserResponse = await dbUtils.isProjectToUser(
      id_project,
      userId
    );
    if (projectToUserResponse && projectToUserResponse.creator === 1) {
      db.query("DELETE FROM Own WHERE id_project=$1 AND id_user=$2", [
        id_project,
        id_user,
      ]);
      res.status(200).json({ status: "OK" });
    } else
      res.status(500).json({
        status: "ERROR",
        desc: "Project not own or you'r not the creator",
      });
  } else
    res.status(500).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

async function deleteProject(req, res) {
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    let projectId = req.params.id;
    let projectToUserResponse = await dbUtils.isProjectToUser(
      projectId,
      userId
    );
    if (projectToUserResponse && projectToUserResponse.creator === 1) {
      db.query("DELETE FROM Own WHERE id_project=$1", [projectId]);
      db.query("DELETE FROM Tasks WHERE id_project=$1", [projectId]);
      db.query("DELETE FROM Projects WHERE id_project=$1", [projectId]);
      res.status(200).json({ status: "OK" });
    }
  }
}

async function quitProject(req, res) {
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    let projectId = req.params.id;
    let projectToUserResponse = await dbUtils.isProjectToUser(
      projectId,
      userId
    );
    if (projectToUserResponse && projectToUserResponse.creator === 0) {
      db.query("DELETE FROM Own WHERE id_project=$1 AND id_user=$2", [
        projectId,
        userId,
      ]);
      res.status(200).json({ status: "OK" });
    }
  }
}

async function rename(req, res) {
  let userId = jwtUtils.getUserId(req);
  if (userId) {
    let projectId = req.params.id;
    let newProjectName = req.body.newName;
    let projectToUserResponse = await dbUtils.isProjectToUser(
      projectId,
      userId
    );
    if (projectToUserResponse && projectToUserResponse.creator === 1) {
      db.query("UPDATE Projects SET title=$1 WHERE id_project=$2", [
        newProjectName,
        projectId,
      ]);
      console.log("Edition...");
      res.status(200).json({ status: "OK" });
    } else res.status(400).json({ status: "ERROR", desc: "Project not own" });
  } else
    res.status(400).json({
      status: "ERROR",
      desc: "Authentication failed",
    });
}

module.exports = {
  collaborators,
  allInfos,
  create,
  addTask,
  addCollaborator,
  removeCollaborator,
  deleteProject,
  quitProject,
  rename,
};
