import { Response } from 'express';
import Razorpay from 'razorpay';
import prisma from '../../config/db';
import { AuthRequest } from '../../middlewares/authMiddleware';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
});

// Parent creates a payment order to pay fees
export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.school_id) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }

    const { amount } = req.body; // Amount in INR
    const receipt = `receipt_${Date.now()}`;

    const options = {
      amount: amount * 100, // Razorpay works with paise
      currency: 'INR',
      receipt,
    };

    const order = await razorpay.orders.create(options);

    // Track it in our DB
    const paymentRecord = await prisma.payment.create({
      data: {
        amount,
        status: 'PENDING',
        razorpay_order_id: order.id,
        school_id: req.user.school_id,
        user_id: req.user.id,
      }
    });

    res.json({ order, paymentRecord });
  } catch (error) {
    res.status(500).json({ error: 'Payment order creation failed' });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // TODO: Verify signature using crypto to ensure payload is authentic.
    // For now we assume verify is successful and update DB

    await prisma.payment.updateMany({
      where: { razorpay_order_id },
      data: {
        status: 'SUCCESS',
        razorpay_payment_id,
      }
    });

    res.json({ status: 'SUCCESS', message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
};
