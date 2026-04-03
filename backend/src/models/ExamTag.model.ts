import mongoose, { Document, Schema } from 'mongoose';

export interface IExamTag extends Document {
  name: string;
  category: string;
  countryCode: string;
}

const ExamTagSchema = new Schema<IExamTag>({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  countryCode: { type: String, default: 'IN' },
});

export default mongoose.model<IExamTag>('ExamTag', ExamTagSchema);
