import mongoose from "mongoose";

let cached: typeof mongoose | null = (global as any)._mongoose ?? null;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
  if (cached) return cached;
  cached = await mongoose.connect(uri);
  (global as any)._mongoose = cached;
  return cached;
}
