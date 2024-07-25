const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Mentor = require("../models/mentorModel");
const Appointment = require("../models/appointmentModel");

//Register callback
const registerController = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      res.status(200).send({ message: "User Already exists", success: false });
      return res.end();
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // generate salt with 10 rounds

    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .send({ message: "User registered successfully!", success: true });
    res.end();
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error while creating user", success: false, error });
    res.end();
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid Password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    console.log(process.env.JWT_SECRET);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

// get user by id callback
const getUserController = async (req, res) => {
  try {
    const response = await User.findOne({ _id: req.body.userId });
    if (!response) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: response,
      });
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, err });
  }
};

//mark all notification as seen callback
const markNotificationSeenController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];
    user.seenNotifications = seenNotifications;
    const updateUser = await user.save();
    updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All Notification marked as seen",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while applying for doctor",
      success: false,
      error,
    });
    res.end();
  }
};

//delete all notification seen
const deleteNotificationController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.unseenNotifications = [];
    user.seenNotifications = [];
    const updateUser = await user.save();
    updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All Notification deleted",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while applying for doctor",
      success: false,
      error,
    });
    res.end();
  }
};

//apply mentor controller

const applyMentorController = async (req, res) => {
  try {
    const mentorUser = await Profile.findOne({ userId: req.body.userId });
    const newMentor = new Mentor({ ...req.body, name: mentorUser.firstName });
    await newMentor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const unseenNotifications = adminUser.unseenNotifications;

    unseenNotifications.push({
      type: "new-mentor-request",
      message: `${mentorUser.firstName} ${mentorUser.lastName} has applied for mentor's account`,
      data: {
        mentorId: mentorUser._id,
        name: mentorUser.firstName + mentorUser.lastName,
      },
      onClickPath: "/api/user/mentor",
    });

    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      message: "Mentor account applied successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error while applying for mentor",
      success: false,
      error,
    });
    res.end();
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const getAllMentors = async (req, res) => {
  try {
    const users = await Mentor.find({});
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
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
    const mentorId = req.body.mentorId;
    //const userId = req.body.userId;
    // here userId coming from authMiddleware so conflict is occur here so we use alternative here
    const status = req.body.status;

    console.log("request", req.body);

    await Mentor.findByIdAndUpdate(mentorId, { status });
    const mentor = await Mentor.find({});

    const user = await User.findOne({ _id: doc.userId });
    user.isMentor = status === "approved" ? true : false;
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "new-mentor-request-changed",
      message: `Your mentor account has been ${status}`,
      data: {
        mentorId: mentor._id,
        name: mentor.firstName + mentor.lastName,
      },
      onClickPath: "/notifications",
    });
    await User.findByIdAndUpdate(user._id, { unseenNotifications });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Doctor status updated successfully",
      data: doctor,
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

const getMentorsAccount = async (req, res) => {
  try {
    const response = await Mentor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Mentor account fetched successfully !",
      data: response,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error getting doctors info", success: false, err });
  }
};

//Update User profile controller

const updateProfileAccount = async (req, res) => {
  try {
    const userExists = await Profile.findOne({ userId: req.body.userId });

    if (userExists) {
      const response = await Profile.findOneAndUpdate(
        { userId: req.body.userId },
        req.body
      );
      if (response) {
        res
          .status(200)
          .send({ message: "Profile updated successfully", success: true });
        return res.end();
      } else {
        res
          .status(500)
          .send({ message: "Unable to update profile", success: false });
        return res.end();
      }
    } else {
      const newProfile = new Profile(req.body);
      await newProfile.save();
      res
        .status(200)
        .send({ message: "Profile created successfully", success: true });
      return res.end();
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error updating profiles info", success: false, err });
  }
};
//Get User profile controller
const getProfileAccount = async (req, res) => {
  try {
    const response = await Profile.findOne({ userId: req.body.userId });
    if (response) {
      res.status(200).send({
        success: true,
        message: "Profile fetched successfully !",
        data: response,
      });
      return res.end();
    } else {
      res.status(500).send({
        success: false,
        message: "No profile available of this id",
      });
      return res.end();
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error getting profiles info", success: false, err });
  }
};

const getAllApprovedMentors = async (req, res) => {
  try {
    const users = await Mentor.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Mentors fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const studentId = req.body.studentId;
    const newAppointment = new Appointment(req.body, { userId: studentId });
    await newAppointment.save();
    const mentorId = req.body.mentorId;
    const mentor = await User.findOne({ userId: mentorId });
    mentor.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment requested by ${req.body.username}`,
      onClickPath: "/appointments",
    });
    await mentor.save();
    const user = await User.findOne({ userId: studentId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment requested by ${req.body.username}`,
      onClickPath: "/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
    res.end();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error booking appointment",
      error,
    });
  }
};

//test controller

const testController = (req, res) => {
  res.send("Test Controller");
};

module.exports = {
  registerController,
  loginController,
  testController,
  getUserController,
  markNotificationSeenController,
  deleteNotificationController,
  applyMentorController,
  getAllUsers,
  getAllMentors,
  changeMentorsStatus,
  getMentorsAccount,
  updateProfileAccount,
  getAllApprovedMentors,
  bookAppointment,
  getProfileAccount,
};
