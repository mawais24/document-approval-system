// src/lib/mongodb.ts
import "server-only";
import mongoose from "mongoose";

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: Cached | undefined;
}

const cached: Cached = global.__mongoose ?? { conn: null, promise: null };
if (!global.__mongoose) global.__mongoose = cached;

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  // Use Railway's built-in MONGO_URL only
  const uri = process.env.MONGO_URL;
  if (!uri) {
    throw new Error("Missing MONGO_URL - check Railway MongoDB service");
  }

  console.log("Connecting to MongoDB with Railway built-in MONGO_URL");

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
