import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRating extends Document {
  order: Types.ObjectId;
  reviewer: Types.ObjectId;
  seller: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    order:    { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String },
  },
  { timestamps: true }
);

RatingSchema.index({ order: 1, reviewer: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', RatingSchema);
