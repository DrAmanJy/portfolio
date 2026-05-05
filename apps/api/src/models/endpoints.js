import { Schema, model, Types } from "mongoose";

const headerSchema = new Schema(
  {
    key: { type: String, trim: true },
    required: { type: Boolean, default: false },
    example: { type: String, trim: true },
  },
  { _id: false },
);

const endpointSchema = new Schema(
  {
    projectId: {
      type: Types.ObjectId,
      ref: "Project",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      required: true,
    },

    path: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    requiredHeaders: [headerSchema],

    queryParams: [
      {
        key: String,
        required: Boolean,
        example: String,
      },
    ],

    requestBody: {
      type: Schema.Types.Mixed,
    },

    sampleRequest: {
      type: Schema.Types.Mixed,
    },

    sampleResponse: {
      type: Schema.Types.Mixed,
    },

    responses: [
      {
        code: Number,
        description: String,
      },
    ],

    isPublic: {
      type: Boolean,
      default: true,
    },

    version: {
      type: String,
      default: "v1",
    },
  },
  { timestamps: true },
);

endpointSchema.index({ projectId: 1 });
endpointSchema.index({ method: 1 });
endpointSchema.index({ path: 1 });

export default model("Endpoint", endpointSchema);
