import express, { Request, Response } from 'express';
import { userOnly } from '../middleware/authMiddleware';
import { Order } from '../model/orderModel';
import { Address } from '../model/addressModel';
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

router.post('/create-order', userOnly, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { _id } = req.user;
    const { items, total_amount } = req.body;

    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Validation Error: Items are required' });
    }

    if (!total_amount || total_amount <= 0) {
      return res.status(400).json({ message: 'Validation Error: Total amount must be greater than 0' });
    }

    
    const address = await Address.findOne({ user_id: _id });

    if (!address) {
      return res.status(400).json({ message: 'Address not found for the authenticated user' });
    }

   
    const newOrder = new Order({
      user_id: _id,
      items,
      total_amount,
      shipping_address: address._id  
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
