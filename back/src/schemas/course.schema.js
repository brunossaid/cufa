import { z } from "zod";

export const createCourseSchema = z.object({
  code: z
    .string({ required_error: "Code is required" })
    .trim()
    .min(1, { message: "Code cannot be empty" }),
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name cannot be empty" }),
  workload: z
    .number({ required_error: "Workload is required" })
    .positive({ message: "Workload must be positive" }),
  year: z.union(
    [
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(null),
    ],
    { required_error: "Year is required" }
  ),
  semester: z.union([z.literal(1), z.literal(2), z.literal(null)], {
    required_error: "Semester is required",
  }),
  type: z.enum(["mandatory", "optional", "extraescolar"], {
    required_error: "Type is required",
  }),
  prerequisites: z
    .array(
      z
        .string({ required_error: "Prerequisite ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" })
    )
    .optional(),
  modality: z.enum(["presential", "virtual", "mixed"], {
    required_error: "Modality is required",
  }),
  color: z
    .string({ required_error: "Color is required" })
    .trim()
    .min(1, { message: "Color cannot be empty" }),
  user: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid User ID format" }),
});
