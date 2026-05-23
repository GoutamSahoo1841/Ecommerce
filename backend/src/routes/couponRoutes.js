import express from 'express';
import {
  getCouponByCode,
  createCoupon,
  getCoupons,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.route('/:code').get(getCouponByCode);

router.route('/:id').delete(protect, admin, deleteCoupon);

export default router;
