import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getCourse,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createCourseSchema } from "../schemas/course.schema.js";

const router = Router();

router.get("/courses", authRequired, getCourses);
router.get("/courses/:id", authRequired, getCourse);
router.post(
  "/courses",
  authRequired,
  validateSchema(createCourseSchema),
  createCourse
);
router.put("/courses/:id", authRequired, updateCourse);
router.delete("/courses/:id", authRequired, deleteCourse);

export default router;
