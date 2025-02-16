import mongoose from "mongoose";
import period from "./period.model.js";
import plan from "./plan.model.js";

// esquema de materias (COURSES)
const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    workload: { type: Number, required: true },
    modality: {
      type: String,
      enum: ["presential", "virtual", "mixed"],
      required: true,
    },
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
    year: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    semester: { type: Number, enum: [1, 2], required: true },
    type: { type: String, enum: ["mandatory", "optional"], required: true },
    color: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// eliminar referencias en "periods" y "plans" antes de borrar un course
courseSchema.pre("findOneAndDelete", async function (next) {
  // buscamos el curso a eliminar
  const courseId = this.getQuery()._id;
  const course = await mongoose.model("course").findById(courseId);

  if (!course) return next(); // si no existe, salimos

  // eliminamos referencias "prerequisites" de otros courses
  await mongoose
    .model("course")
    .updateMany(
      { prerequisites: courseId },
      { $pull: { prerequisites: courseId } }
    );

  // eliminamos referencias en "periods"
  await period.updateMany(
    { "courses.courseId": courseId },
    { $pull: { courses: { courseId: courseId } } }
  );

  // eliminamos referencias en "plans"
  await plan.updateMany(
    { "cells.courseCode": course.code },
    { $pull: { cells: { courseCode: course.code } } }
  );

  next();
});

export default mongoose.model("course", courseSchema);
