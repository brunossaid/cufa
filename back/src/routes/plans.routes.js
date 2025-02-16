import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getPlan,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  removeCourseFromPlan,
} from "../controllers/plans.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPlanSchema } from "../schemas/plan.schema.js";

const router = Router();

router.get("/plans", authRequired, getPlans);
router.get("/plans/:id", authRequired, getPlan);
router.post(
  "/plans",
  authRequired,
  validateSchema(createPlanSchema),
  createPlan
);
router.put("/plans/:id", authRequired, updatePlan);
router.delete("/plans/:id/remove-course", authRequired, removeCourseFromPlan);
router.delete("/plans/:id", authRequired, deletePlan);

export default router;
