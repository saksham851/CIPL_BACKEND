import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    if (!decodedToken.userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findById(decodedToken.userId);

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

export const userOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    if (!decodedToken.userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user as UserDoc;

    next();
  } catch (error) {
    console.error('Error in userOnly middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
