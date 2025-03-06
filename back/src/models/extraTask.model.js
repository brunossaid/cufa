import mongoose from "mongoose";

// esquema de extraTasks
const extraTaskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("extraTask", extraTaskSchema);
