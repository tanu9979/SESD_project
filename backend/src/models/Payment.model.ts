import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPayment extends Document {
  order: Types.ObjectId;
  amount: number;
  method: 'card' | 'upi' | 'cod';
  status: 'pending' | 'success' | 'failed';
  transactionId?: string;
  paidAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order:         { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    amount:        { type: Number, required: true },
    method:        { type: String, enum: ['card', 'upi', 'cod'], default: 'card' },
    status:        { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionId: { type: String },
    paidAt:        { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
