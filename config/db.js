const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/nith-mentorship"
);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongodb Atlas connected successfully!");
});

connection.on("error", () => {
  console.log("Failed to connect Mongodb Atlas !");
});

module.exports = mongoose;
