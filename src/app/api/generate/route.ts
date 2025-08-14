// src/app/api/generate/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // évite tout cache côté Next

type Body = { prompt?: string };

// Fallback garanti (toujours en HTTPS, toujours une image)
function fallbackImage(size = "1024x1024") {
  const [w, h] = size.split("x");
  return `https://placekitten.com/${w}/${h}`;
}

function json(body: any, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(req: Request) {
  const { prompt = "" } = (await req.json().catch(() => ({}))) as Body;

  // Mode maquette explicite
  if (process.env.IMAGE_MOCK_MODE === "true") {
    const url = fallbackImage();
    console.log("[/api/generate] MOCK =>", url);
    return json({ imageUrl: url });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // Pas de clé → fallback chaton
  if (!apiKey) {
    const url = fallbackImage();
    console.log("[/api/generate] NO KEY =>", url);
    return json({ imageUrl: url });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const r = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });
    const url = r.data?.[0]?.url;
    console.log("[/api/generate] OPENAI url =>", url);
    if (!url) throw new Error("No URL from OpenAI");
    return json({ imageUrl: url });
  } catch (err: any) {
    const url = fallbackImage();
    console.log("[/api/generate] ERROR => fallback", err?.code || err?.message, url);
    return json({ imageUrl: url });
  }
}
