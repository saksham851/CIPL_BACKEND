import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db'; 
import authRoutes from './routes/login'; 
import productRoute from './routes/AddProductRoute';
import addressRoutes from './routes/addressRoute'
import orderRoute  from './routes/orderRoute'

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

//route for login
app.use('/api/auth', authRoutes);
// Use order routes
app.use('/api/product', productRoute);
//route for address
app.use('/api', addressRoutes);
//route for order
app.use('/api', orderRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Home');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
