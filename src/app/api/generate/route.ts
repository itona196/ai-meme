import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type Body = { prompt?: string };

function svgDataUrl(prompt: string, size = "1024x1024") {
  const [w, h] = size.split("x");
  const safe = (prompt || "AI Meme").slice(0, 80).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#111"/>
        <stop offset="100%" stop-color="#333"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif"
          font-size="${Math.max(24, Math.floor(Number(w) / 20))}" dy=".35em">${safe}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function POST(req: Request) {
  const { prompt = "" } = (await req.json().catch(() => ({}))) as Body;

  if (process.env.IMAGE_MOCK_MODE === "true") {
    return NextResponse.json({ imageUrl: svgDataUrl(prompt) });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ imageUrl: svgDataUrl(prompt) });
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
  } catch (err) {
    console.error("[/api/generate] error:", err);
    return NextResponse.json({ imageUrl: svgDataUrl(prompt) }, { status: 200 });
  }
}
