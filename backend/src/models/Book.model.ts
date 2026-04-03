import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  price: number;
  type: 'sell' | 'rent' | 'both' | 'donate';
  status: 'available' | 'sold' | 'rented' | 'donated';
  image?: string;
  description?: string;
  sellerInsights?: string;
  donorNote?: string;
  sellerPincode?: string;
  examTags: Types.ObjectId[];
  owner: Types.ObjectId;
  createdAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title:          { type: String, required: true, trim: true },
    author:         { type: String, required: true, trim: true },
    category:       { type: String, trim: true },
    condition:      { type: String, enum: ['new', 'like-new', 'good', 'fair'], required: true },
    price:          { type: Number, required: true, default: 0, min: 0 },
    type:           { type: String, enum: ['sell', 'rent', 'both', 'donate'], default: 'sell' },
    status:         { type: String, enum: ['available', 'sold', 'rented', 'donated'], default: 'available' },
    image:          { type: String },
    description:    { type: String },
    sellerInsights: { type: String },
    donorNote:      { type: String },
    sellerPincode:  { type: String },
    examTags:       [{ type: Schema.Types.ObjectId, ref: 'ExamTag' }],
    owner:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

BookSchema.index({ category: 1 });
BookSchema.index({ status: 1 });
BookSchema.index({ type: 1 });
BookSchema.index({ owner: 1 });
BookSchema.index({ title: 'text', author: 'text', description: 'text' });

export default mongoose.model<IBook>('Book', BookSchema);
