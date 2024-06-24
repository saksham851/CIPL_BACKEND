import express, { Request, Response } from 'express';
import { adminOnly } from '../middleware/authMiddleware';
import { User } from '../model/userModel';
import { Order } from '../model/orderModel';
import { Address } from '../model/addressModel';
import { UserDoc, AddressDoc, OrderDoc } from '../interfaces/user';

const router = express.Router();

router.get('/user-report', adminOnly, async (req: Request, res: Response) => {
  try {
    const { item_number, page = 1, limit = 10, sort_by, sort_direction = 'asc' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let users: UserDoc[] = [];

    if (sort_by === 'total_amount') {
      const sortDirection = sort_direction === 'desc' ? -1 : 1;

      const usersWithTotalAmount = await User.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'user_id',
            as: 'orders'
          }
        },
        {
          $addFields: {
            total_amount: { $sum: '$orders.total_amount' }
          }
        },
        {
          $sort: { total_amount: sortDirection }
        },
        { $skip: skip },
        { $limit: Number(limit) }
      ]);

      users = usersWithTotalAmount as UserDoc[];
    } else {
      const sortOptions: any = {};
      if (sort_by && ['username', 'email', 'role'].includes(sort_by as string)) {
        sortOptions[sort_by as string] = sort_direction === 'desc' ? -1 : 1;
      } else {
        sortOptions['username'] = sort_direction === 'desc' ? -1 : 1;
      }

      if (!item_number) {
        users = await User.find({}).sort(sortOptions).skip(skip).limit(Number(limit)) as UserDoc[];
      } else {
        const itemRegex = new RegExp(item_number as string, 'i');
        const usersWithMatchingOrders = await User.aggregate([
          {
            $lookup: {
              from: 'orders',
              localField: '_id',
              foreignField: 'user_id',
              as: 'orders'
            }
          },
          {
            $match: {
              'orders.items.item_number': { $regex: itemRegex }
            }
          },
          { $sort: sortOptions },
          { $skip: skip },
          { $limit: Number(limit) }
        ]) as UserDoc[];

        users = usersWithMatchingOrders;
      }
    }

    const userReports = await Promise.all(users.map(async (user) => {
      let orders: OrderDoc[] = [];

      if (item_number) {
        const itemRegex = new RegExp(item_number as string, 'i');
        orders = await Order.find({ user_id: user._id, 'items.item_number': { $regex: itemRegex } }).exec();
        orders = orders.map(order => ({
          ...order.toObject(),
          items: order.items.filter(item => item.item_number.match(itemRegex))
        })) as OrderDoc[];
      } else {
        orders = await Order.find({ user_id: user._id }).exec() as OrderDoc[];
      }

      const addresses = await Address.find({ user_id: user._id }).exec() as AddressDoc[];

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePhoto: user.profilePhoto
        },
        orders,
        addresses
      };
    }));

    res.status(200).json({
      userReports,
      page: Number(page),
      totalPages: Math.ceil(users.length / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching user report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
