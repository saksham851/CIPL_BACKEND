import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log(`Mongodb connected to ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Mongodb Error: ${error}`);   
  }
};
