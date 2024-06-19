import mongoose from 'mongoose';
import { OrderDoc } from '../interfaces/user'; 

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    items: { type: [String], required: true }
});

export const Order = mongoose.model<OrderDoc>('Order', orderSchema);


