import express from 'express';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords } from '../utils/bcryptUtils';
import { User } from '../model/userModel';
import { UserDoc } from '../interfaces/user';

export const loginOrSignup = async (req: express.Request, res: express.Response): Promise<void> => {
  const { username, password, email, role } = req.body;

  
  if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string' || (role && typeof role !== 'string')) {
    res.status(400).json({ message: 'Invalid input: username, password, email, and role must all be strings.' });
    return;
  }

  try {
    const existingUser = await User.findOne({ username }) as UserDoc;

    if (existingUser) {
      
      const passwordMatch = await comparePasswords(password, existingUser.password);
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
      console.log('Creating new user');
      const passwordHash = await hashPassword(password);
      const newUser = new User({
        username,
        email,
        password: passwordHash,
        role,
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
