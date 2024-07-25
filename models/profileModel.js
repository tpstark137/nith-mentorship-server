const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    bio: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    degree: {
      type: String,
    },
    major: {
      type: String,
    },
    passoutYear: {
      type: String,
    },
    schoolName: {
      type: String,
    },
    schoolPassoutYear: {
      type: String,
    },
    skills: {
      type: String,
    },
    resumeLink: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const profileModel = mongoose.model("profiles", profileSchema);
module.exports = profileModel;
