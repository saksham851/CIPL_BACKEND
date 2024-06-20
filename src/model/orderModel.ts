import mongoose from 'mongoose';
import { OrderDoc } from '../interfaces/user';

const orderSchema = new mongoose.Schema<OrderDoc>({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_date: { type: Date, default: Date.now },
  items: [{
    quantity: { type: Number, required: true }
  }],
  total_amount: { type: Number, required: true },
  shipping_address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true }
});

export const Order = mongoose.model<OrderDoc>('Order', orderSchema);
