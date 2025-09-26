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

  // Build connection string from Railway's individual MongoDB variables
  const host = process.env.MONGOHOST;
  const port = process.env.MONGOPORT;
  const user = process.env.MONGOUSER;
  const password = process.env.MONGOPASSWORD;
  const prebuiltUrl = process.env.MONGO_URL;

  let uri: string;

  if (prebuiltUrl) {
    uri = prebuiltUrl;
  } else if (host && port && user && password) {
    uri = `mongodb://${user}:${password}@${host}:${port}`;
  } else {
    throw new Error(
      "Missing MongoDB connection details. Need either MONGO_URL or MONGOHOST, MONGOPORT, MONGOUSER, MONGOPASSWORD"
    );
  }

  console.log("Connecting to MongoDB...");

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
