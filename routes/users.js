const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Exercise = require("../models/Exercise");

//2. You can POST to /api/users with form data username to create a new user.
//POST, create a new user
router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const newUser = new User({ name: username });
    console.log(newUser);
    await newUser.save();
    return res.json({ username: newUser.name, _id: newUser._id });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

//4. You can make a GET request to /api/users to get a list of all users.
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(
      users.map((user) => ({
        username: user.name,
        _id: user._id,
      })),
    );
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

//7. You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
router.post("/:id/exercises", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!req.body.description || !req.body.duration) {
      return res
        .status(400)
        .json({ error: "Description and duration are required" });
    }
    const userID = req.params.id;
    const des = req.body.description;
    const dur = parseInt(req.body.duration);
    let newDate;
    if (req.body.date) {
      newDate = new Date(req.body.date);
    } else {
      newDate = new Date();
      console.log("Received date:", newDate);
    }
    const newExercise = new Exercise({
      userId: userID,
      description: des,
      duration: dur,
      date: newDate,
    });
    await newExercise.save();
    return res.json({
      username: user.name,
      _id: newExercise.userId,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date.toDateString(),
    });
  } catch (err) {
    console.error("Error creating exercise:", err);
    return res.status(500).json({ error: "Failed to create exercise" });
  }
});

//9. You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
router.get("/:id/logs", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const fromDate = req.query.from ? new Date(req.query.from) : null;
    const toDate = req.query.to ? new Date(req.query.to) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    //filters the exercises
    const filter = { userId: user._id };
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }
    const count = await Exercise.countDocuments(filter);

    const allExercises = Exercise.find(filter);
    if (limit) allExercises.limit(limit);
    const exercises = await allExercises.exec();

    return res.json({
      username: user.name,
      count: count,
      _id: user._id,
      log: exercises.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
      })),
    });
  } catch (err) {
    console.error("Error fetching exercise logs:", err);
    return res.status(500).json({ error: "Failed to fetch exercise logs" });
  }
});

module.exports = router;
