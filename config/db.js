const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://tpaul:6283588549@cluster0.sxpis5j.mongodb.net/mentorship"
);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongodb Atlas connected successfully!");
});

connection.on("error", () => {
  console.log("Failed to connect Mongodb Atlas !");
});

module.exports = mongoose;
