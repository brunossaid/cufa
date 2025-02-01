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
    [z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)],
    { required_error: "Year is required" }
  ),
  semester: z.union([z.literal(1), z.literal(2)], {
    required_error: "Semester is required",
  }),
  type: z.enum(["mandatory", "optional"], {
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

/*
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
  status: z.enum(["approved", "promoted", "pending", "in_progress"], {
    required_error: "Status is required",
  }),
  workload: z
    .number({ required_error: "Workload is required" })
    .positive({ message: "Workload must be positive" }),
  year: z.union(
    [z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)],
    { required_error: "Year is required" }
  ),
  semester: z.union([z.literal(1), z.literal(2)], {
    required_error: "Semester is required",
  }),
  type: z.enum(["mandatory", "optional"], {
    required_error: "Type is required",
  }),

  // Opcionales
  commission: z.string().trim().optional(),
  professors: z
    .array(
      z.object({
        name: z.string({ required_error: "Professor name is required" }).trim(),
        email: z.string().email().trim().optional(),
      })
    )
    .optional(),
  schedule: z.string().trim().optional(),
  classroom: z.string().trim().optional(),
  grade: z.number().min(0).max(10).optional(),
  prerequisites: z
    .array(
      z
        .string({ required_error: "Prerequisite ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" }) // valida formato de ObjectId
    )
    .optional(),
  periods: z
    .array(
      z.object({
        year: z
          .number({ required_error: "Year is required" })
          .min(1900, { message: "Year must be greater than or equal to 1900" })
          .max(new Date().getFullYear(), {
            message: "Year must be less than or equal to the current year",
          }),
        semester: z.enum(["1", "2"], {
          required_error: "Semester is required",
        }),
        status: z.boolean({ required_error: "Period status is required" }),
      })
    )
    .optional(),
  modality: z.enum(["presential", "virtual", "mixed"]).optional(),
  observations: z.string().trim().optional(),
  color: z
    .string({ required_error: "Color is required" })
    .trim()
    .min(1, { message: "Color cannot be empty" }),
});
*/
