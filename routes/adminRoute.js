const express = require("express");
const {
  testController,
  getAppliedMentors,
  changeMentorsStatus,
  getApprovedMentors,
} = require("../controller/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
//router object
const router = express.Router();

//routes

router.get("/test", testController);
router.get("/get-mentors", authMiddleware, getAppliedMentors);
router.post("/change-mentor-status", authMiddleware, changeMentorsStatus);
router.get("/approved-mentors", authMiddleware, getApprovedMentors);

module.exports = router;
