import mongoose from 'mongoose';
import { ProductDoc } from '../interfaces/user';

const productSchema = new mongoose.Schema<ProductDoc>({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }
});

export const Product = mongoose.model<ProductDoc>('Product', productSchema);
