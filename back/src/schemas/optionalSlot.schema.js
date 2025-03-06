import { z } from "zod";

export const createOptionalSlotSchema = z.object({
  user: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid User ID format" }),
  year: z.union(
    [z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)],
    { required_error: "Year is required" }
  ),
  semester: z.union([z.literal(1), z.literal(2)], {
    required_error: "Semester is required",
  }),
});
