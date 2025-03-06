import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getOptionalSlots,
  createOptionalSlot,
  deleteOptionalSlot,
} from "../controllers/optionalSlots.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createOptionalSlotSchema } from "../schemas/optionalSlot.schema.js";

const router = Router();

router.get("/optionalSlots", authRequired, getOptionalSlots);
router.post(
  "/optionalSlots",
  authRequired,
  validateSchema(createOptionalSlotSchema),
  createOptionalSlot
);
router.delete("/optionalSlots/:id", authRequired, deleteOptionalSlot);

export default router;
