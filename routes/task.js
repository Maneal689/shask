const express = require('express');
const router = express.Router();

const taskCtrl = require('./controllers/taskCtrl');

router.get('/:id/toggle', taskCtrl.toggleChecked);
router.get('/:id/remove', taskCtrl.remove);
router.post('/:id/config', taskCtrl.config);

module.exports = router;
