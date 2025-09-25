import mongoose, { Schema } from "mongoose";
import { IDocument } from "../types";

const DocumentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["application/pdf"],
    },
    uploadedBy: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    uploaderName: {
      type: String,
      required: true,
      trim: true,
    },
    workflowId: {
      type: String,
      required: true,
      ref: "Workflow",
    },
    workflowName: {
      type: String,
      required: true,
      trim: true,
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalSteps: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in-progress", "approved", "rejected", "completed"],
      default: "pending",
      index: true,
    },
    approvals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Approval",
      },
    ],
    uniqueTrackingNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    oneDriveUrl: { type: String },
    oneDriveFileId: { type: String },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    rejectedBy: {
      type: String,
      ref: "User",
    },
    rejectedAt: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for efficient queries
DocumentSchema.index({ uploadedBy: 1, status: 1 });
DocumentSchema.index({ status: 1, currentStep: 1 });
DocumentSchema.index({ workflowId: 1, status: 1 });
DocumentSchema.index({ createdAt: -1 });

export const Document =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);
