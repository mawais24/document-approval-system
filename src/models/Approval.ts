import mongoose, { Schema } from "mongoose";
import { IApproval } from "../types";

const ApprovalSchema = new Schema<IApproval>(
  {
    documentId: {
      type: String,
      required: true,
      ref: "Document",
      index: true,
    },
    approverId: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    approverName: {
      type: String,
      required: true,
      trim: true,
    },
    stepNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    comments: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    signedAt: { type: Date },
    signatureApplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for efficient queries
ApprovalSchema.index({ documentId: 1, stepNumber: 1 });
ApprovalSchema.index({ approverId: 1, status: 1 });

export const Approval =
  mongoose.models.Approval ||
  mongoose.model<IApproval>("Approval", ApprovalSchema);
