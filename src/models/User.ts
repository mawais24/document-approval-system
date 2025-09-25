// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: "uploader" | "approver" | "ceo" | "admin";
  department?: string;
  position?: string;
  signatureUrl?: string;
  stampUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      // unique: true,   // ✅ REMOVE this line
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["uploader", "approver", "ceo", "admin"],
      default: "uploader",
    },
    department: { type: String, trim: true },
    position: { type: String, trim: true },
    signatureUrl: { type: String },
    stampUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes (one definition only)
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, isActive: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
