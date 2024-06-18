import express from 'express';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords } from '../utils/bcryptUtils'; 
import User from '../model/userModel'; 

const app: express.Application = express();

export const loginOrSignup = async (req: express.Request, res: express.Response): Promise<void> => {
  const { username, password, email } = req.body;

  try {
  
    const existingUser = await User.findOne({ username });

    if (existingUser) {
     
      const passwordMatch = await comparePasswords(password, existingUser.passwordHash);
      if (!passwordMatch) {
        res.status(401).json({ message: 'Invalid password' });
        return;
      }

      
      const token = jwt.sign({ userId: existingUser.id, username: existingUser.username }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000, 
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(200).json({ message: 'Login successful' });
    } else {
      
      const passwordHash = await hashPassword(password);
      const newUser = new User({
        username,
        email,
        passwordHash,
      
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser.id, username: newUser.username }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000, 
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(201).json({ message: 'User created and logged in' });
    }
  } catch (error) {
    console.error('Error logging in or signing up user:', error);
    res.status(500).json({ message: 'Failed to login or signup user' });
  }
};

