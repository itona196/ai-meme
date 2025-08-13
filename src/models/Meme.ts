import { Schema, model, models, Document } from "mongoose";

export interface MemeDoc extends Document {
  imageUrl: string;
  topText: string;
  bottomText: string;
  votes: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemeSchema = new Schema<MemeDoc>(
  {
    imageUrl: { type: String, required: true },
    topText: { type: String, default: "" },
    bottomText: { type: String, default: "" },
    votes: { type: Number, default: 0 },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

export const Meme = models.Meme || model<MemeDoc>("Meme", MemeSchema);
