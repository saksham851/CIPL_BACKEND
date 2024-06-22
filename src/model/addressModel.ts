import mongoose from 'mongoose';
import { AddressDoc } from '../interfaces/user';

const addressSchema = new mongoose.Schema<AddressDoc>({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: Number, required: true }
});

export const Address = mongoose.model<AddressDoc>('Address', addressSchema);
