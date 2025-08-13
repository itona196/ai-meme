import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Meme Generator",
  description: "Generate and share memes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
 codex/build-mvp-ai-meme-generator
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-950 text-neutral-100`}
      >
        <div className="container mx-auto p-4">{children}</div>
      <body className="antialiased">
        {children}
      main
      </body>
    </html>
  );
}
