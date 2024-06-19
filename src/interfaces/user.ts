import mongoose from 'mongoose';

// Interface for User document
interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  role?: string;
}

// Interface for Order document
interface OrderDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  orderId: number;
  orderDate: Date;
  items: string[];
}

// Interface for Address document
interface AddressDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipcode: string;
}

export { UserDoc, OrderDoc, AddressDoc };
