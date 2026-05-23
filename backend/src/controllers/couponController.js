import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';

// @desc    Get coupon by code
// @route   GET /api/coupons/:code
// @access  Public
export const getCouponByCode = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ 
    code: req.params.code.toUpperCase(), 
    isActive: true 
  });

  if (coupon) {
    // Check if expired
    if (coupon.expireAt && coupon.expireAt < Date.now()) {
      res.status(400);
      throw new Error('This coupon has expired');
    }
    res.json(coupon);
  } else {
    res.status(404);
    throw new Error('Invalid coupon code');
  }
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercentage, expireAt } = req.body;

  const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

  if (couponExists) {
    res.status(400);
    throw new Error('Coupon code already exists');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountPercentage,
    expireAt,
  });

  if (coupon) {
    res.status(201).json(coupon);
  } else {
    res.status(400);
    throw new Error('Invalid coupon data');
  }
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await Coupon.deleteOne({ _id: coupon._id });
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});
