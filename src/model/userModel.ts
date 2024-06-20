import mongoose from 'mongoose';
import { UserDoc } from '../interfaces/user';

const userSchema = new mongoose.Schema<UserDoc>({
  username: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  password: { type: String, required: true },
  email: { type: String, required: true }
});

export const User = mongoose.model<UserDoc>('User', userSchema);
