import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAddress extends Document {
  user: Types.ObjectId;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>({
  user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName:  { type: String, required: true },
  phone:     { type: String, required: true },
  street:    { type: String, required: true },
  city:      { type: String, required: true },
  state:     { type: String, required: true },
  pincode:   { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

export default mongoose.model<IAddress>('Address', AddressSchema);
