import mongoose, { Schema, Document } from 'mongoose';
import { UserDoc } from '../interfaces/user';

const userSchema = new Schema<UserDoc>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User = mongoose.model<UserDoc>('User', userSchema);

export { User, UserDoc };
