import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().trim().optional(),
  user: z
    .string({ required_error: "User ID is required" })
    .trim()
    .min(1, { message: "User ID cannot be empty" }),
  cells: z
    .array(
      z.object({
        day: z.enum(
          ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
          {
            required_error: "Day is required",
          }
        ),
        hour: z
          .number({ required_error: "Hour is required" })
          .min(0, { message: "Hour must be between 0 and 23" })
          .max(23, { message: "Hour must be between 0 and 23" }),
        courseCode: z
          .string({ required_error: "Course code is required" })
          .trim()
          .min(1, { message: "Course code cannot be empty" }),
      })
    )
    .optional(), // Hacemos que 'cells' no sea obligatorio
});
