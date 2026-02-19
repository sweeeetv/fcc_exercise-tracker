const mongoose = require("mongoose");

const exeSchema = new mongoose.Schema({
  userId: String,
  description: String,
  duration: Number,
  date: Date,
});

const Exercise = mongoose.model("Exercise", exeSchema);

module.exports = Exercise;
