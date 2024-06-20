import express from 'express';
import { loginOrSignup } from '../controllers/userController'
import upload from '../middleware/multerMiddleware'

const router = express.Router();

router.post('/login',upload.single('profilePhoto'),loginOrSignup );

export default router;
