const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://appuser:apppass123@localhost:27017/document-approval";

async function testConnection() {
  try {
    console.log("🔗 Attempting to connect to MongoDB...");
    console.log("URI:", MONGODB_URI.replace(/\/\/.*@/, "//***:***@")); // Hide credentials

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connection successful!");
    console.log("📊 Database:", mongoose.connection.name);
    console.log("🏠 Host:", mongoose.connection.host);
    console.log("🚪 Port:", mongoose.connection.port);

    // Test creating a simple document
    const testSchema = new mongoose.Schema({ message: String });
    const TestModel = mongoose.model("Test", testSchema);

    const testDoc = new TestModel({ message: "Hello from Docker MongoDB!" });
    await testDoc.save();
    console.log("✅ Test document created successfully");

    await TestModel.deleteOne({ _id: testDoc._id });
    console.log("✅ Test document deleted successfully");

    await mongoose.disconnect();
    console.log("✅ Disconnected successfully");
    console.log("\n🎉 Database setup is working perfectly!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("1. Make sure Docker is running");
    console.log("2. Run: npm run docker:mongo");
    console.log("3. Wait 30 seconds for MongoDB to start");
    console.log("4. Try again");
    process.exit(1);
  }
}

testConnection();
