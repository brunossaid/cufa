import { z } from "zod";

export const createExtraTaskSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, {
      message: "Invalid color format. Use #RRGGBB",
    })
    .optional(),
  user: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid User ID format" }),
});
