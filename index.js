const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
