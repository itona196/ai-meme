import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const schema = z.object({ prompt: z.string().min(1) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI key" }, { status: 500 });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: parsed.data.prompt,
      size: "1024x1024",
    });
    const imageUrl = result.data?.[0]?.url;
    if (!imageUrl) throw new Error("No image returned");
    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
