# AI Meme Generator

A minimal Next.js app that lets users generate images with the OpenAI Images API, overlay text to create memes, save them to MongoDB and share or vote on their favorites.

## Tech Stack
- Next.js App Router & TypeScript
- TailwindCSS
- MongoDB with Mongoose
- OpenAI Images API

## Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in real values.
3. Start the dev server:
   ```bash
   npm run dev
   ```

## API
- `POST /api/generate` – body `{ prompt }` → `{ imageUrl }`
- `GET /api/memes` – list latest memes
- `POST /api/memes` – create meme `{ imageUrl, topText?, bottomText? }`
- `GET /api/memes/:slug` – fetch meme by slug
- `PATCH /api/memes/:slug` – body `{ action: "upvote" | "downvote" }`

## License
MIT
