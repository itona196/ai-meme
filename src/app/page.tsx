"use client";

import { useEffect, useState } from "react";

interface Meme {
  _id: string;
  imageUrl: string;
  topText: string;
  bottomText: string;
  votes: number;
  slug: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemes = async () => {
    const res = await fetch("/api/memes");
    const data = await res.json();
    setMemes(data);
  };

  useEffect(() => {
    fetchMemes();
  }, []);

const generate = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    console.log("generate =>", data);
    if (res.ok && data?.imageUrl) {
      const url = String(data.imageUrl);
      setImageUrl(url.startsWith("data:") ? url : url + (url.includes("?") ? "&" : "?") + `_ts=${Date.now()}`);
    }
  } finally {
    setLoading(false);
  }
};


  const saveMeme = async () => {
    if (!imageUrl) return;
    await fetch("/api/memes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, topText, bottomText }),
    });
    setPrompt("");
    setTopText("");
    setBottomText("");
    setImageUrl("");
    fetchMemes();
  };

  const vote = async (slug: string, action: "upvote" | "downvote") => {
    await fetch(`/api/memes/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    fetchMemes();
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Prompt"
            className="w-full p-2 rounded bg-neutral-800"
          />
          <button
            onClick={generate}
            disabled={!prompt || loading}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            Generate
          </button>
          <input
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="Top text"
            className="w-full p-2 rounded bg-neutral-800"
          />
          <input
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="Bottom text"
            className="w-full p-2 rounded bg-neutral-800"
          />
          <button
            onClick={saveMeme}
            disabled={!imageUrl}
            className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
          >
            Save meme
          </button>
        </div>
        <div className="relative aspect-square bg-neutral-800 rounded overflow-hidden">
          {imageUrl && (
            <img
  src={imageUrl}
  alt="preview"
  className="object-cover w-full h-full"
  referrerPolicy="no-referrer"
  crossOrigin="anonymous"
  onError={(e) => {
    console.warn("Image failed:", imageUrl);
    (e.currentTarget as HTMLImageElement).src = "https://source.unsplash.com/random/1024x1024/?fallback";
  }}
/>

          )}
          {topText && (
            <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold drop-shadow text-xl">
              {topText}
            </span>
          )}
          {bottomText && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold drop-shadow text-xl">
              {bottomText}
            </span>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-xl mb-4">Latest memes</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {memes.map((m) => (
            <div
              key={m._id}
              className="bg-neutral-800 rounded overflow-hidden relative"
            >
              <a href={`/m/${m.slug}`}>
                <img
                  src={m.imageUrl}
                  alt="meme"
                  className="object-cover w-full h-full"
                />
                {m.topText && (
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold drop-shadow text-xl">
                    {m.topText}
                  </span>
                )}
                {m.bottomText && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold drop-shadow text-xl">
                    {m.bottomText}
                  </span>
                )}
              </a>
              <div className="flex items-center justify-between p-2 bg-neutral-900">
                <span>{m.votes}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => vote(m.slug, "upvote")}
                    className="px-2 bg-neutral-700 rounded"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => vote(m.slug, "downvote")}
                    className="px-2 bg-neutral-700 rounded"
                  >
                    -1
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
