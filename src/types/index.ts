export interface IUser {
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

export interface IWorkflowStep {
  stepNumber: number;
  approverId: string;
  approverName: string;
  approverEmail: string;
  required: boolean;
}

export interface IWorkflow {
  _id: string;
  name: string;
  description?: string;
  steps: IWorkflowStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  _id: string;
  title: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploaderName: string;
  workflowId: string;
  workflowName: string;
  currentStep: number;
  totalSteps: number;
  status: "pending" | "in-progress" | "approved" | "rejected" | "completed";
  approvals: string[];
  uniqueTrackingNumber?: string;
  oneDriveUrl?: string;
  oneDriveFileId?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApproval {
  _id: string;
  documentId: string;
  approverId: string;
  approverName: string;
  stepNumber: number;
  status: "pending" | "approved" | "rejected";
  comments?: string;
  signedAt?: Date;
  signatureApplied: boolean;
  createdAt: Date;
  updatedAt: Date;
}
