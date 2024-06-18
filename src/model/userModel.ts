import mongoose from 'mongoose';
import { User } from '../interfaces/user'; 

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:{type:String,required:true,unique:true},
  passwordHash: { type: String, required: true },
});

export default mongoose.model<User>('User', UserSchema);
