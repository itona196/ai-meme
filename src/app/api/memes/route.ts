import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Meme } from "@/models/Meme";

export async function GET() {
  await connectDB();
  const memes = await Meme.find().sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json(memes);
}

const schema = z.object({
  imageUrl: z.string().url(),
  topText: z.string().max(100).optional().default(""),
  bottomText: z.string().max(100).optional().default(""),
});

function generateSlug() {
  return Math.random().toString(36).substring(2, 10);
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await connectDB();
  const slug = generateSlug();
  const meme = await Meme.create({ ...parsed.data, slug });
  return NextResponse.json(meme, { status: 201 });
}
