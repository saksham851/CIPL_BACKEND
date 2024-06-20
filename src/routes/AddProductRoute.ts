import express, { Request, Response } from 'express';
import { adminOnly } from '../middleware/authMiddleware';
import { Product } from '../model/ProductModel';
import { UserDoc } from '../interfaces/user'; 


declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}

const router = express.Router();

router.post('/create-product', adminOnly, async (req: Request, res: Response) => {
  try {
    
    if (!req.user) {
      return res.status(400).json({ message: 'User not authenticated' });
    }
    const { _id } = req.user;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Validation Error: Name is required' });
    }

    const newProduct = new Product({ name, user_id: _id });
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
