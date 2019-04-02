const { Client } = require('pg');

let connectObj = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: true,
      }
    : {
          user: 'maneal',
          host: 'localhost',
          database: 'shaskdb',
          password: '',
          port: 5432,
      };

const db = new Client(connectObj);
db.connect();

function isProjectToUser(projectId, userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Own WHERE id_project=$1 AND id_user=$2', [
            projectId,
            userId,
        ])
            .then(res => resolve(res.rows.length > 0 ? res.rows[0] : false))
            .catch(err => console.error(err));
    });
}

module.exports = {
    isProjectToUser,
    db,
};
