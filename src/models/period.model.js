import mongoose from "mongoose";

// esquema de profesores
const professorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
});

// esquema de horarios
const scheduleSchema = new mongoose.Schema({
  startTime: {
    type: String, // formato: "HH:mm"
    required: true,
    trim: true,
  },
  endTime: {
    type: String, // formato: "HH:mm"
    required: true,
    trim: true,
  },
  day: {
    type: String,
    required: true,
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  },
  modality: {
    type: String,
    required: true,
    enum: ["virtual", "presential"], // virtual - presencial
  },
});

// esquema de períodos (PERIODS)
const periodSchema = new mongoose.Schema(
  {
    year: {
      type: Number, // año de cursada
      required: true,
    },
    semester: {
      type: Number, // cuatrimestre de cursada
      enum: [1, 2],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "course", // referencia a la colección "course"
          required: true,
        },
        status: {
          type: String,
          enum: ["approved", "promoted", "disapproved", "in_progress"],
          required: true,
        },
        grade: {
          type: Number,
          min: 0,
          max: 10,
        },
        finalGrade: {
          type: Number,
          min: 0,
          max: 10,
        },
        building: {
          type: String,
          trim: true,
        },
        classroom: {
          type: String,
          trim: true,
        },
        commission: {
          type: String,
          trim: true,
        },
        professors: [professorSchema], // array de profesores
        schedules: [scheduleSchema], // array de horarios
        observations: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true } // createdAt - updatedAt
);

export default mongoose.model("period", periodSchema);
