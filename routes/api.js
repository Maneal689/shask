const express = require('express');
const router = express.Router();

const jwtUtils = require('../utils/jwtUtils');
const projectRouter = require('./project');
const taskRouter = require('./task')
const userRouter = require('./user');

router.use((req, res, next) => {
    //Get token from cookie session
    let token = req.session.accessToken;
    //If token's valid then save again the cookie to expand his life time for 1 hour
    if (jwtUtils.parseToken(token)) {
        req.session.accessToken = null;
        req.session.accessToken = token;
    }
    next();
});

router.use('/project', projectRouter);
router.use('/user', userRouter);
router.use('/task', taskRouter);


router.get('*', (req, res) => {
    res.status(404).json({ status: 'ERROR', desc: 'Undefined page' });
});

module.exports = router;
