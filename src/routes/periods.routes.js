import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getPeriod,
  getPeriods,
  createPeriod,
  updatePeriod,
  deletePeriod,
  deleteCourseFromPeriod,
} from "../controllers/periods.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPeriodSchema } from "../schemas/period.schema.js";

const router = Router();

router.get("/periods", authRequired, getPeriods);
router.get("/periods/:id", authRequired, getPeriod);
router.post(
  "/periods",
  authRequired,
  validateSchema(createPeriodSchema),
  createPeriod
);
router.put("/periods/:id", authRequired, updatePeriod);
router.delete("/periods/:id", authRequired, deletePeriod);
router.delete(
  "/periods/:periodId/courses/:courseId",
  authRequired,
  deleteCourseFromPeriod
);

export default router;
