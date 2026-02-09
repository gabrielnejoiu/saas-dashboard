import { z } from "zod";

/**
 * Validation schema for project status
 */
export const projectStatusSchema = z.enum(["ACTIVE", "ON_HOLD", "COMPLETED"]);

/**
 * Validation schema for creating a project
 */
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  status: projectStatusSchema,
  deadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  assignedTo: z
    .string()
    .min(1, "Team member name is required")
    .max(100, "Team member name must be less than 100 characters"),
  budget: z
    .number()
    .min(0, "Budget must be a positive number")
    .max(999999999, "Budget is too large"),
});

/**
 * Validation schema for updating a project
 */
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters")
    .optional(),
  status: projectStatusSchema.optional(),
  deadline: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  assignedTo: z
    .string()
    .min(1, "Team member name is required")
    .max(100, "Team member name must be less than 100 characters")
    .optional(),
  budget: z
    .number()
    .min(0, "Budget must be a positive number")
    .max(999999999, "Budget is too large")
    .optional(),
});

/**
 * Type inference from schemas
 */
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
