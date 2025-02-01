import { z } from "zod";

export const createPeriodSchema = z.object({
  year: z
    .number({ required_error: "Year is required" })
    .min(1900, { message: "Year must be greater than or equal to 1900" })
    .max(new Date().getFullYear(), {
      message: "Year must be less than or equal to the current year",
    }),
  semester: z.union([z.literal(1), z.literal(2)], {
    required_error: "Semester is required",
  }),
  user: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid User ID format" }),
  courses: z.array(
    z.object({
      courseId: z
        .string({ required_error: "Course ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Course ID format" }),
      status: z.enum(["approved", "promoted", "disapproved", "in_progress"], {
        required_error: "Status is required",
      }),
      grade: z.number().min(0).max(10).optional(),
      finalGrade: z.number().min(0).max(10).optional(),
      building: z.string().trim().optional(),
      classroom: z.string().trim().optional(),
      commission: z.string().trim().optional(),
      professors: z
        .array(
          z.object({
            name: z
              .string({ required_error: "Professor name is required" })
              .trim(),
            email: z.string().email().trim().optional(),
          })
        )
        .optional(),
      schedules: z
        .array(
          z.object({
            startTime: z
              .string({ required_error: "Start time is required" })
              .trim(),
            endTime: z
              .string({ required_error: "End time is required" })
              .trim(),
            day: z.enum(
              [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
              ],
              {
                required_error: "Day is required",
              }
            ),
            modality: z.enum(["virtual", "presential"], {
              required_error: "Modality is required",
            }),
          })
        )
        .optional(),
      observations: z.string().trim().optional(),
    })
  ),
});
