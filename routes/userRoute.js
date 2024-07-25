const express = require("express");
const {
  loginController,
  registerController,
  testController,
  getUserController,
  markNotificationSeenController,
  deleteNotificationController,
  updateProfileAccount,
  getProfileAccount,
  applyMentorController,
  bookAppointment,
} = require("../controller/userController");

const authMiddleware = require("../middlewares/authMiddleware");
//router object
const router = express.Router();

//routes
// POST || LOGIN USER
router.post("/login", loginController);

//POST || REGISTER USER
router.post("/register", registerController);

//POST || GET USER BY ID
router.post("/get-user-by-id", authMiddleware, getUserController);

//POST || MARK NOTIFICATIONS AS SEEN
router.post(
  "/mark-notification-seen",
  authMiddleware,
  markNotificationSeenController
);

//POST || DELETE ALL NOTIFICATIONS
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteNotificationController
);

//POST || USERS PROFILE
router.post("/edit-profile", authMiddleware, updateProfileAccount);
router.post("/get-edit-profile", authMiddleware, getProfileAccount);

//POST || APPLY TO BE MENTOR
router.post("/apply-mentor", authMiddleware, applyMentorController);

router.get("/test", testController);
router.post("/book-appointment", authMiddleware, bookAppointment);

module.exports = router;
