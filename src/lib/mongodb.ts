// src/lib/mongodb.ts
import "server-only";
import mongoose from "mongoose";

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Use a non-conflicting global cache key
declare global {
  // eslint-disable-next-line no-var
  var __mongoose: Cached | undefined;
}

const cached: Cached = global.__mongoose ?? { conn: null, promise: null };
if (!global.__mongoose) global.__mongoose = cached;

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  // Read env only when actually connecting
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL; // optional fallback
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB, // optional
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
