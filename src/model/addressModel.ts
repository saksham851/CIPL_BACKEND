import mongoose from 'mongoose';
import { AddressDoc } from '../interfaces/user'; 

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true }
});

export const Address = mongoose.model<AddressDoc>('Address', addressSchema);

