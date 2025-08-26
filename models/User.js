const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = new Schema({
  firstname: String,
  lastname: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", user);
