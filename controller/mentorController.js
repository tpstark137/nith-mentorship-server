const Mentor = require("../models/mentorModel");
const User = require("../models/userModel");

const testController = (req, res) => {
  res.send("Test Controller");
};

module.exports = {
  testController,
};
