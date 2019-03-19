const express = require('express');
const router = express.Router();

const userCtrl = require('./controllers/userCtrl');

router.get('/logged', userCtrl.logged);
router.get('/logout', userCtrl.logout);
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/search', userCtrl.search)
router.get('/me', userCtrl.me);
router.get('/info-of/:id', userCtrl.getInfoOf);

module.exports = router;
