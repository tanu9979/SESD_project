import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  countryCode: string;
  currencyCode: string;
  avgRating: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:     { type: String, required: true },
    role:         { type: String, enum: ['user', 'admin'], default: 'user' },
    countryCode:  { type: String, default: 'IN' },
    currencyCode: { type: String, default: 'INR' },
    avgRating:    { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);


export default mongoose.model<IUser>('User', UserSchema);
