import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  book: Types.ObjectId;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    buyer:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book:   { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  },
  { timestamps: true }
);

ConversationSchema.index({ buyer: 1, seller: 1, book: 1 }, { unique: true });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
