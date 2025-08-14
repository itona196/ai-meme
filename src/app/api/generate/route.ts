import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type Body = { prompt?: string };

// --- Helpers mock basés sur le prompt ---
function keywordsFromPrompt(prompt: string) {
  return (prompt.toLowerCase().match(/[a-zà-ÿ]+/g) || [])
    .filter((w) => w.length > 3)
    .slice(0, 3)
    .join(",");
}

function placeholderFromPrompt(prompt: string, size = "1024x1024") {
  const [w, h] = size.split("x");
  const tags = encodeURIComponent(keywordsFromPrompt(prompt) || "meme");
  return `https://source.unsplash.com/random/${w}x${h}/?${tags}`;
}


export async function POST(req: Request) {
  const { prompt = "" } = (await req.json().catch(() => ({}))) as Body;

  // Mode maquette explicite
  if (process.env.IMAGE_MOCK_MODE === "true") {
    return NextResponse.json({ imageUrl: placeholderFromPrompt(prompt) });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Pas de clé → fallback mock
    return NextResponse.json({ imageUrl: placeholderFromPrompt(prompt) });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });
    const url = result.data?.[0]?.url;
    if (!url) throw new Error("No URL from OpenAI");
    return NextResponse.json({ imageUrl: url });
  } catch (err: any) {
    // Quota atteint → fallback mock lié au prompt
    if (err?.code === "billing_hard_limit_reached") {
      return NextResponse.json(
        { imageUrl: placeholderFromPrompt(prompt), note: "fallback: mock image (billing limit reached)" },
        { status: 200 }
      );
    }
    console.error("[/api/generate] error:", err);
    return NextResponse.json({ error: "image_generation_failed" }, { status: 500 });
  }
}
