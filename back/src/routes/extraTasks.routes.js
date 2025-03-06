import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getExtraTask,
  getExtraTasks,
  createExtraTask,
  updateExtraTask,
  deleteExtraTask,
} from "../controllers/extraTasks.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createExtraTaskSchema } from "../schemas/extraTask.schema.js";

const router = Router();

router.get("/extraTasks", authRequired, getExtraTasks);
router.get("/extraTasks/:id", authRequired, getExtraTask);
router.post(
  "/extraTasks",
  authRequired,
  validateSchema(createExtraTaskSchema),
  createExtraTask
);
router.put("/extraTasks/:id", authRequired, updateExtraTask);
router.delete("/extraTasks/:id", authRequired, deleteExtraTask);

export default router;
