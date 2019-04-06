const jwt = require('jsonwebtoken');
var jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) jwtSecret = require('../config').jwtSecret;

function parseToken(auth) {
  //Verify that access key is defined
  if (auth) {
    //Take only the jwt token without 'Bearer '
    let jwtToken = auth.split(' ')[1];
    //Verify token with secret key
    try {
      let tokenObj = jwt.verify(jwtToken, jwtSecret);
      //If tokenObj defined and is verified
      if (tokenObj) return tokenObj;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function createUserToken(userData) {
  return 'Bearer ' + jwt.sign({ userId: userData.id_user }, jwtSecret);
}

function getUserId(req) {
  if (req.session.accessToken) {
    let obj = parseToken(req.session.accessToken);
    if (obj) return obj.userId;
  }
  return undefined;
}

module.exports = {
  parseToken,
  createUserToken,
  getUserId,
};
