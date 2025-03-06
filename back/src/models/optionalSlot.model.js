import mongoose from "mongoose";

// esquema de optionalSlots
const optionalSlotSchema = new mongoose.Schema(
  {
    year: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    semester: { type: Number, enum: [1, 2], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("optionalSlot", optionalSlotSchema);
