import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // si es obligatorio
      trim: true, // saca los espacios
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // que sea unico
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
