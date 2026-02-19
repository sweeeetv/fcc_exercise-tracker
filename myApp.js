const express = require("express");
const cors = require("cors");

//import routes
const userRoutes = require("./routes/users");

//global variables
const TIMEOUT = 10000;

//middleware
function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static("public"));
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });

  //routes
  app.use("/api/users", userRoutes);
  return app;
}

module.exports = createApp;
