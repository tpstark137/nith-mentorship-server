const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    mentorId: {
      type: String,
    },
    mentorName: {
      type: String,
    },
    userName: {
      type: String,
    },
    agenda: {
      type: String,
    },
    meetLink: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
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

const appointmentModel = mongoose.model("appointments", appointmentSchema);
module.exports = appointmentModel;
