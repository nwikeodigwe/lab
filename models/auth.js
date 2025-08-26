const mongoose = require("mongoose");
const { Schema } = mongoose;

const auth = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: Boolean,
    default: true,
  },
  reset: {
    token: {
      type: String,
    },
    expires: {
      type: Date,
    },
  },
});

module.exports = mongoose.model("Auth", auth);
