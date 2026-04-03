import mongoose, { Document, Schema, Types } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'payment_confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface IOrder extends Document {
  buyer: Types.ObjectId;
  book: Types.ObjectId;
  address: Types.ObjectId;
  totalAmount: number;
  status: OrderStatus;
  estimatedDelivery?: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    buyer:             { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book:              { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    address:           { type: Schema.Types.ObjectId, ref: 'Address' },
    totalAmount:       { type: Number, required: true },
    status:            { type: String, enum: ['pending','payment_confirmed','processing','shipped','out_for_delivery','delivered','completed','cancelled'], default: 'pending' },
    estimatedDelivery: { type: Date },
    confirmedAt:       { type: Date },
    shippedAt:         { type: Date },
    outForDeliveryAt:  { type: Date },
    deliveredAt:       { type: Date },
    cancelledAt:       { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
