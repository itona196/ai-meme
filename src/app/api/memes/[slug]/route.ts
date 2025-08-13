import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Meme } from "@/models/Meme";
import { z } from "zod";

export async function GET(_req: Request, context: any) {
  await connectDB();
  const meme = await Meme.findOne({ slug: context.params.slug }).lean();
  if (!meme) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(meme);
}

const patchSchema = z.object({ action: z.enum(["upvote", "downvote"]) });

export async function PATCH(req: Request, context: any) {
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await connectDB();
  const change = parsed.data.action === "upvote" ? 1 : -1;
  const meme = await Meme.findOneAndUpdate(
    { slug: context.params.slug },
    { $inc: { votes: change } },
    { new: true }
  ).lean();
  if (!meme) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(meme);
}
