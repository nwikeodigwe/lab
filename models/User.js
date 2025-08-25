import mongoose from "mongoose";
const { Schema } = mongoose;

const User = new Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  bio: String,
  profilePicture: String,
  date: { type: Date, default: Date.now },
  status: Boolean,
});

export default mongoose.model("User", User);
