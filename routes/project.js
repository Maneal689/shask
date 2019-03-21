const express = require('express');
const router = express.Router();

const projectCtrl = require('./controllers/projectCtrl');

router.get('/:id/collaborators', projectCtrl.collaborators);
router.get('/:id/allInfos', projectCtrl.allInfos);
router.get('/:id/removeCollaborator', projectCtrl.removeCollaborator);
router.get('/:id/delete', projectCtrl.deleteProject);
router.get('/:id/quit', projectCtrl.quitProject);
router.post('/:id/addTask', projectCtrl.addTask);
router.post('/create', projectCtrl.create);
router.post('/:id/addCollaborator', projectCtrl.addCollaborator);

module.exports = router;
