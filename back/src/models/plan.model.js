import mongoose from "mongoose";

// esquema de las celdas
const cellSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  },
  hour: {
    type: Number, // hora en formato de 24hs
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "itemType", // puede ser un course o un extraTask
  },
  itemType: {
    type: String,
    required: true,
    enum: ["course", "extraTask"],
  },
});

// esquema del plan
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cells: {
      type: [cellSchema],
      validate: {
        validator: function (cells) {
          const uniqueCells = new Set(
            cells.map((cell) => `${cell.day}-${cell.hour}`)
          );
          return uniqueCells.size === cells.length;
        },
        message: "No se permiten celdas duplicadas (día-horario).",
      },
    },
  },
  { timestamps: true } // createdAt - updatedAt
);

export default mongoose.model("Plan", planSchema);
