const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Task-Manger is running here.");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
