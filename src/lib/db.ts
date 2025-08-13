import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let cached: typeof mongoose | null = (global as any)._mongoose ?? null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;
  cached = await mongoose.connect(MONGODB_URI);
  (global as any)._mongoose = cached;
  return cached;
}
