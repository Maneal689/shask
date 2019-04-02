const express = require('express');
const router = express.Router();

const taskCtrl = require('./controllers/taskCtrl');

router.get('/:id/remove', taskCtrl.remove);
router.post('/config', taskCtrl.config);

module.exports = router;
