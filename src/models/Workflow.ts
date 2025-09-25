import mongoose, { Schema } from "mongoose";
import { IWorkflow, IWorkflowStep } from "../types";

const WorkflowStepSchema = new Schema<IWorkflowStep>({
  stepNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  approverId: {
    type: String,
    required: true,
    ref: "User",
  },
  approverName: {
    type: String,
    required: true,
    trim: true,
  },
  approverEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  required: {
    type: Boolean,
    default: true,
  },
});

const WorkflowSchema = new Schema<IWorkflow>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    steps: {
      type: [WorkflowStepSchema],
      required: true,
      validate: {
        validator: function (steps: IWorkflowStep[]) {
          return steps.length > 0 && steps.length <= 10;
        },
        message: "Workflow must have between 1 and 10 steps",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
WorkflowSchema.index({ isActive: 1 });
WorkflowSchema.index({ createdBy: 1 });

export const Workflow =
  mongoose.models.Workflow ||
  mongoose.model<IWorkflow>("Workflow", WorkflowSchema);
