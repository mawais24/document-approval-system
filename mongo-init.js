// This script runs when MongoDB starts for the first time
// It creates a user for our application

db = db.getSiblingDB("document-approval");

db.createUser({
  user: "appuser",
  pwd: "apppass123",
  roles: [
    {
      role: "readWrite",
      db: "document-approval",
    },
  ],
});

print("✅ Database user created successfully");
