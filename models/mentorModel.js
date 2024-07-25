const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
    },
    companyName: {
      type: String,
    },
    designation: {
      type: String,
    },
    joinDate: {
      type: String,
    },
    experience: {
      type: Number,
    },
    techstack: {
      type: String,
    },
    info: {
      type: String,
    },
    topics: {
      type: String,
    },
    timings: {
      type: Array,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const mentorModel = mongoose.model("mentors", mentorSchema);
module.exports = mentorModel;
