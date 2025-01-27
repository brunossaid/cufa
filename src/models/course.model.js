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

// esquema de correlativas
const prerequisiteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { strict: true }
);

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

// esquema de materias
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    commission: {
      type: String,
      trim: true,
    },
    professors: [professorSchema], // array de profesores
    workload: {
      type: Number, // carga horaria en horas
      required: true,
    },
    schedules: [scheduleSchema], // array de horarios
    classroom: {
      type: String, // aula
      trim: true,
    },
    building: {
      type: String, // edificio
      trim: true,
    },
    grade: {
      type: Number, // nota de la materia, si ya fue cursada
      min: 0,
      max: 10,
    },
    status: {
      type: String,
      enum: ["approved", "promoted", "pending", "in_progress"], // estado de la materia
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    year: {
      // año en el que se deberia cursar
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    semester: {
      // cuatrimestre en el que se deberia cursar
      type: Number,
      enum: [1, 2],
      required: true,
    },
    prerequisites: [prerequisiteSchema], // array de correlativas
    type: {
      type: String,
      enum: ["mandatory", "optional"], // obligatoria - optativa
      required: true,
    },
    periods: [
      {
        year: {
          type: Number, // año en el que se curso
          min: 1900, // limite inferior
          max: new Date().getFullYear(), // limite superior (año acutal)
        },
        semester: {
          type: Number,
          enum: [1, 2], // primer cuatrimestre(1) - segundo cuatrimestre(2)
        },
        status: {
          type: String,
          enum: ["approved", "promoted", "pending", "in_progress"], // estado
        },
      },
    ],
    modality: {
      type: String,
      enum: ["presential", "virtual", "mixed"], // modalidad
      required: true,
    },
    observations: {
      type: String,
      trim: true, // comentarios
    },
    color: {
      type: String,
      trim: true, // color
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // createdAt - updatedAt
);

export default mongoose.model("course", courseSchema);
