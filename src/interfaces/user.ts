import mongoose from 'mongoose';

// Interface for User document
export interface UserDoc extends mongoose.Document {
  _id:string;
  username: string;
  role: 'user' | 'admin';
  password: string;
  email: string;
  profilePhoto?: string;
}

// Interface for Address document
export interface AddressDoc extends mongoose.Document {
  user_id: mongoose.Types.ObjectId;
  address: string;
  city: string;
  state: string;
  zipcode: number;
}

// Interface for Product document
export interface ProductDoc extends mongoose.Document {
  user_id: mongoose.Types.ObjectId;
  name: string;
}

// Interface for Order document
export interface OrderDoc extends mongoose.Document {
  user_id: mongoose.Types.ObjectId;
  order_date: Date;
  items: {
    item_number: string;
    quantity: number;
  }[];
  total_amount: number;
  shipping_address: mongoose.Types.ObjectId;
}
