import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRental extends Document {
  renter: Types.ObjectId;
  book: Types.ObjectId;
  address?: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  returnedDate?: Date;
  dailyRate: number;
  totalAmount: number;
  status: 'active' | 'returned' | 'overdue';
  createdAt: Date;
}

const RentalSchema = new Schema<IRental>(
  {
    renter:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book:         { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    address:      { type: Schema.Types.ObjectId, ref: 'Address' },
    startDate:    { type: Date, required: true },
    endDate:      { type: Date, required: true },
    returnedDate: { type: Date },
    dailyRate:    { type: Number, required: true },
    totalAmount:  { type: Number, required: true },
    status:       { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model<IRental>('Rental', RentalSchema);
