import express from 'express';
import { adminOnly } from '../middleware/authMiddleware';
import { Order } from '../model/orderModel';


const router = express.Router();

// Route to create a new order
router.post('/create', adminOnly, async (req, res) => {
    try {
        const { userId, orderId, orderDate, items } = req.body;
        
        const newOrder = new Order({
            userId,
            orderId,
            orderDate,
            items
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error });
    }
});

export default router;