import { Request, Response, NextFunction } from 'express';
import { UserDoc } from '../interfaces/user'; 
import { User } from '../model/userModel';


declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: UserDoc;
    }
  }
}

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const userId = req.body.userId;
       
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
    }

    const user = await User.findById(userId).populate('role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

   
    req.user = user as UserDoc;

    next();
  } catch (error) {
    console.error('Error in adminOnly middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
