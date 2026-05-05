import { Schema, model } from "mongoose";

const recentUpdateSchema = new Schema(
  {
    message: {
      type: String,
      trim: true,
      maxlength: [120, "Update message cannot exceed 120 characters"],
      required: [true, "Update message is required"],
    },
    commitId: {
      type: String,
      trim: true,
      maxlength: [40, "Commit ID cannot exceed 40 characters"],
      required: [true, "Commit ID is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Project slug is required"],
      unique: true,
      minlength: [3, "Slug must be at least 3 characters long"],
      maxlength: [50, "Slug cannot exceed 50 characters"],
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },

    name: {
      type: String,
      trim: true,
      required: [true, "Project name is required"],
      minlength: [3, "Project name must be at least 3 characters long"],
      maxlength: [64, "Project name cannot exceed 64 characters"],
    },

    status: {
      type: String,
      required: [true, "Project status is required"],
      enum: {
        values: ["LIVE", "BETA", "IN_DEV", "OFF"],
        message:
          "Invalid status '{VALUE}'. Allowed values: LIVE, BETA, IN_DEV, OFF",
      },
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Project description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [512, "Description cannot exceed 512 characters"],
    },

    stack: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one technology must be specified in the stack",
      },
    },

    architecture: {
      frontend: {
        type: String,
        trim: true,
        maxlength: [124, "Frontend tech cannot exceed 124 characters"],
      },
      backend: {
        type: String,
        trim: true,
        maxlength: [124, "Backend tech cannot exceed 124 characters"],
      },
      database: {
        type: String,
        trim: true,
        maxlength: [124, "Database tech cannot exceed 124 characters"],
      },
    },

    healthScore: {
      type: Number,
      required: [true, "Health score is required"],
      min: [0, "Health score cannot be less than 0"],
      max: [100, "Health score cannot exceed 100"],
    },

    lastDeployed: {
      type: Date,
      required: [true, "Last deployed date is required"],
    },

    repoUrl: {
      type: String,
      trim: true,
      required: [true, "Repository URL is required"],
      match: [
        /^https?:\/\/.+/,
        "Repository URL must be a valid HTTP or HTTPS URL",
      ],
    },

    liveUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Live URL must be a valid HTTP or HTTPS URL"],
    },

    keyFeatures: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one key feature is required",
      },
    },

    recentUpdates: [recentUpdateSchema],

    category: {
      type: String,
      required: [true, "Project category is required"],
      enum: {
        values: ["FRONTEND", "BACKEND", "DATABASE", "API"],
        message:
          "Invalid category '{VALUE}'. Allowed values: FRONTEND, BACKEND, DATABASE, API",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

// --- Indexes ---
projectSchema.index({ status: 1 });
projectSchema.index({ category: 1 });

const Projects = model("Project", projectSchema);

export default Projects;
