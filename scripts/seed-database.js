// scripts/seed-database.js - Create Sample Data
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models (we'll need to adjust paths for CommonJS)
const dbConnect = async () => {
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://appuser:apppass123@localhost:27017/document-approval";
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
};

// Define schemas (duplicated for seeding script)
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
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

const WorkflowStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true, min: 1 },
  approverId: { type: String, required: true, ref: "User" },
  approverName: { type: String, required: true, trim: true },
  approverEmail: { type: String, required: true, lowercase: true, trim: true },
  required: { type: Boolean, default: true },
});

const WorkflowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    steps: { type: [WorkflowStepSchema], required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true, ref: "User" },
  },
  { timestamps: true }
);

// Create models
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Workflow =
  mongoose.models.Workflow || mongoose.model("Workflow", WorkflowSchema);

async function seedDatabase() {
  try {
    await dbConnect();

    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Workflow.deleteMany({});

    console.log("🔐 Hashing passwords...");
    const hashedPassword = await bcrypt.hash("password123", 12);

    console.log("👥 Creating sample users...");
    const users = await User.insertMany([
      {
        email: "admin@company.com",
        password: hashedPassword,
        name: "System Administrator",
        role: "admin",
        department: "IT",
        position: "System Admin",
      },
      {
        email: "uploader@company.com",
        password: hashedPassword,
        name: "Document Uploader",
        role: "uploader",
        department: "Operations",
        position: "Operations Manager",
      },
      {
        email: "manager@company.com",
        password: hashedPassword,
        name: "Department Manager",
        role: "approver",
        department: "Operations",
        position: "Manager",
      },
      {
        email: "director@company.com",
        password: hashedPassword,
        name: "Department Director",
        role: "approver",
        department: "Executive",
        position: "Director",
      },
      {
        email: "ceo@company.com",
        password: hashedPassword,
        name: "Chief Executive Officer",
        role: "ceo",
        department: "Executive",
        position: "CEO",
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    console.log("🔄 Creating sample workflows...");
    const workflows = await Workflow.insertMany([
      {
        name: "Standard Document Approval",
        description:
          "Standard 3-step approval process: Manager → Director → CEO",
        steps: [
          {
            stepNumber: 1,
            approverId: users[2]._id.toString(),
            approverName: users[2].name,
            approverEmail: users[2].email,
            required: true,
          },
          {
            stepNumber: 2,
            approverId: users[3]._id.toString(),
            approverName: users[3].name,
            approverEmail: users[3].email,
            required: true,
          },
          {
            stepNumber: 3,
            approverId: users[4]._id.toString(),
            approverName: users[4].name,
            approverEmail: users[4].email,
            required: true,
          },
        ],
        isActive: true,
        createdBy: users[0]._id.toString(),
      },
      {
        name: "Quick Approval (Manager Only)",
        description: "Single-step approval for routine documents",
        steps: [
          {
            stepNumber: 1,
            approverId: users[2]._id.toString(),
            approverName: users[2].name,
            approverEmail: users[2].email,
            required: true,
          },
        ],
        isActive: true,
        createdBy: users[0]._id.toString(),
      },
      {
        name: "Executive Approval (Director + CEO)",
        description: "Two-step approval for important documents",
        steps: [
          {
            stepNumber: 1,
            approverId: users[3]._id.toString(),
            approverName: users[3].name,
            approverEmail: users[3].email,
            required: true,
          },
          {
            stepNumber: 2,
            approverId: users[4]._id.toString(),
            approverName: users[4].name,
            approverEmail: users[4].email,
            required: true,
          },
        ],
        isActive: true,
        createdBy: users[0]._id.toString(),
      },
    ]);

    console.log(`✅ Created ${workflows.length} workflows`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n=== LOGIN CREDENTIALS ===");
    console.log("Admin:     admin@company.com     / password123");
    console.log("Uploader:  uploader@company.com  / password123");
    console.log("Manager:   manager@company.com   / password123");
    console.log("Director:  director@company.com  / password123");
    console.log("CEO:       ceo@company.com       / password123");
    console.log("=========================");
    console.log("\n📋 Available Workflows:");
    workflows.forEach((workflow) => {
      console.log(`- ${workflow.name} (${workflow.steps.length} steps)`);
    });
    console.log("\n🚀 Ready to start the application!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from database");
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
