import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db'; 
import authRoutes from './routes/login'; 

dotenv.config();

const app: express.Application = express();
const PORT = process.env.MY_PORT

app.use(express.json());
app.use(cookieParser());

connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch((error: Error) => {
    console.error('MongoDB connection error:', error);

  });

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Home');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
