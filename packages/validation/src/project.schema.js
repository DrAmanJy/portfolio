import { z } from "zod";

const architectureSchema = z.strictObject({
  frontend: z.string().trim().max(124).optional(),
  backend: z.string().trim().max(124).optional(),
  database: z.string().trim().max(124).optional(),
});

export const createProjectSchema = z.strictObject({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined || iss.input === ""
          ? "Project name is required."
          : "Project name must be a string.",
    })
    .trim()
    .min(3, "Project name must be at least 3 characters long")
    .max(64, "Project name cannot exceed 64 characters"),

  status: z.enum(["LIVE", "BETA", "IN_DEV", "OFF"], {
    error: (iss) => {
      if (!iss.input) return "Project status is required";
      if (iss.code === "invalid_value") {
        return `"${iss.input}" is not valid. Pick LIVE, BETA, IN_DEV, or OFF.`;
      }
    },
  }),

  description: z
    .string({ error: "Project description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters long")
    .max(512, "Description cannot exceed 512 characters"),

  stack: z
    .array(
      z
        .string({
          error: (iss) =>
            iss.input === undefined || iss.input === ""
              ? "Tech is required."
              : "Tech must be a string.",
        })
        .trim()
        .min(1, "Tech cannot be empty"),
    )
    .min(1, "At least one technology must be specified"),

  architecture: architectureSchema.optional(),

  healthScore: z.coerce
    .number({ error: "Health score must be a valid number." })
    .min(0, "Health score cannot be less than 0")
    .max(100, "Health score cannot exceed 100"),

  repoUrl: z.httpUrl({
    error: (iss) =>
      iss.input === undefined || iss.input === ""
        ? "Repository URL required"
        : "Invalid Repository URL",
  }),

  liveUrl: z.httpUrl("Invalid Live URL").optional(),

  keyFeatures: z
    .array(z.string().trim().min(1, "Feature cannot be empty"))
    .min(1, "At least one key feature is required"),

  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "API"], {
    error: (iss) => {
      if (!iss.input) return "Project category is required";
      if (iss.code === "invalid_value") {
        return `"${iss.input}" is not a valid category.`;
      }
    },
  }),
});
