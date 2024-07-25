const Mentor = require("../models/mentorModel");
const User = require("../models/userModel");

const testController = (req, res) => {
  res.send("Test Controller");
};

const getAppliedMentors = async (req, res) => {
  try {
    const getMentors = await Mentor.find({});
    res.status(200).send({
      message: "mentors fetched successfully",
      success: true,
      data: getMentors,
    });
    res.end();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const changeMentorsStatus = async (req, res) => {
  try {
    const status = req.body.status;
    const user = await User.findById({ _id: req.body.mentorId });
    user.isMentor = status === "approved" ? true : false;

    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "new-mentor-request-changed",
      message: `Your mentor account has been ${status}`,
      onClickPath: "/notifications",
    });

    user.unseenNotifications = unseenNotifications;
    await user.save();
    const mentor = await Mentor.findOne({ userId: req.body.mentorId });
    mentor.status = status;
    await mentor.save();

    res.status(200).send({
      success: true,
      message: "Mentor status updated successfully",
    });

    res.end();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const getApprovedMentors = async (req, res) => {
  try {
    const getMentors = await Mentor.find({ status: "approved" });
    res.status(200).send({
      message: "mentors fetched successfully",
      success: true,
      data: getMentors,
    });
    res.end();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

module.exports = {
  testController,
  getAppliedMentors,
  changeMentorsStatus,
  getApprovedMentors,
};
