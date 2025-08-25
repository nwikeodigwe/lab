import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema({
  firstname: String,
  lastname: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("User", user);
