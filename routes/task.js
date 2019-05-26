const express = require("express");
const router = express.Router();

const taskCtrl = require("./controllers/taskCtrl");

function voteLess(req, res) {
  taskCtrl.vote(req, res, -1);
}

function votePlus(req, res) {
  taskCtrl.vote(req, res, 1);
}

router.get("/:id/remove", taskCtrl.remove);
router.get("/:id/removeSimple", taskCtrl.removeSimple);
router.get("/:id/changeSimple", taskCtrl.changeSimple);
router.post("/addSimple", taskCtrl.addSimple);
router.get("/:id/votePlus", votePlus);
router.get("/:id/voteLess", voteLess);
router.post("/config", taskCtrl.config);

module.exports = router;
