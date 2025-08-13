import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Meme Generator",
  description: "Generate and share memes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-neutral-950 text-neutral-100">
        <div className="container mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
