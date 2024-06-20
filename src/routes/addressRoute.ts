import express, { Request, Response } from 'express';
import { userOnly } from '../middleware/authMiddleware'; 
import { Address } from '../model/addressModel';
import { UserDoc } from '../interfaces/user';

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}

const router = express.Router();

router.post('/create-address', userOnly, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    const { _id } = req.user;
    const { address, city, state, zipcode } = req.body;

    if (!address || !city || !state || !zipcode) {
      return res.status(400).json({ message: 'Validation Error: All address fields are required' });
    }

    const newAddress = new Address({
      user_id: _id,
      address,
      city,
      state,
      zipcode
    });

    await newAddress.save();

    res.status(201).json({ message: 'Address created successfully', address: newAddress });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
