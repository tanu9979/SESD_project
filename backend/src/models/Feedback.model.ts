import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFeedback extends Document {
  user: Types.ObjectId;
  message: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
