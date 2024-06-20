import express from 'express';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords } from '../utils/bcryptUtils';
import { User } from '../model/userModel';
import { UserDoc } from '../interfaces/user';
import { Request, Response } from 'express';

const router = express.Router();

export const loginOrSignup = async (req: Request, res: Response): Promise<void> => {
  const { username, password, email, role } = req.body;


  if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string' || (role && typeof role !== 'string')) {
    res.status(400).json({ message: 'Invalid input: username, password, email, and role must all be strings.' });
    return;
  }

  try {
    let existingUser = await User.findOne({ username }) as UserDoc;

    if (existingUser) {
      const passwordMatch = await comparePasswords(password, existingUser.password);
      if (!passwordMatch) {
        res.status(401).json({ message: 'Invalid password' });
        return;
      }
    } else {
      console.log('Creating new user');
      const passwordHash = await hashPassword(password);

     
      const newUser = new User({
        username,
        email,
        password: passwordHash,
        role,
        profilePhoto: req.file?.filename, 
      });

      existingUser = await newUser.save();
    }

    const token = jwt.sign({ userId: existingUser._id, username: existingUser.username }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in or signing up user:', error);
    res.status(500).json({ message: 'Failed to login or signup user' });
  }
};
