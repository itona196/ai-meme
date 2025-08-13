interface Meme {
  imageUrl: string;
  topText: string;
  bottomText: string;
  votes: number;
  slug: string;
}

export default async function MemePage({ params }: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/memes/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div>Not found</div>;
  }

  const meme: Meme = await res.json();
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/m/${meme.slug}`;

  return (
    <div className="space-y-4">
      <div className="relative mx-auto max-w-xl">
        <img src={meme.imageUrl} alt="meme" className="w-full h-auto rounded" />
        {meme.topText && (
          <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold drop-shadow text-xl">
            {meme.topText}
          </span>
        )}
        {meme.bottomText && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold drop-shadow text-xl">
            {meme.bottomText}
          </span>
        )}
      </div>
      <p className="text-center break-all">{link}</p>
    </div>
  );
}
