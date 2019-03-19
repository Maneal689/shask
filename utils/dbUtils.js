const { Client } = require('pg');

let connectObj = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: true,
      }
    : {
          user: 'maneal',
          host: 'localhost',
          database: 'mylocaldb',
          password: '',
          port: 5432,
      };

const db = new Client(connectObj);
db.connect();

async function isProjectToUser(projectId, userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Own WHERE id_project=$1 AND id_user=$2', [
            projectId,
            userId,
        ])
            .then(res => resolve(res.rows.length > 0))
            .catch(err => console.error(err));
    });
}

async function getUserLastId() {
    let result = await db.query('SELECT MAX(id_user) FROM users');
    if (result && result.rowCount > 0) {
        let lastId = result.rows[0].max;
        return lastId;
    }
    return 0;
}

async function getProjectLastId() {
    let result = await db.query('SELECT MAX(id_project) FROM projects');
    if (result && result.rowCount > 0) {
        let lastId = result.rows[0].max;
        return lastId;
    }
    return 0;
}

async function getTaskLastId() {
    let result = await db.query('SELECT MAX(id_task) FROM tasks');
    console.log('Task request: ', result);
    if (result && result.rowCount > 0) {
        let lastId = result.rows[0].max;
        return lastId;
    }
    return 0;
}

module.exports = {
    isProjectToUser,
    getProjectLastId,
    getUserLastId,
    getTaskLastId,
    db,
};
