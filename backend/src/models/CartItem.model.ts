import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItem extends Document {
  user: Types.ObjectId;
  book: Types.ObjectId;
  addedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book:    { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  addedAt: { type: Date, default: Date.now },
});

CartItemSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);
