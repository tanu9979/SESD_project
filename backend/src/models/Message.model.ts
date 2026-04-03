import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  isRead: boolean;
  sentAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content:      { type: String, required: true },
  isRead:       { type: Boolean, default: false },
  sentAt:       { type: Date, default: Date.now },
});

MessageSchema.index({ conversation: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
