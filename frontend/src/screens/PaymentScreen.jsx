import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Payment Method</h1>
        <p className="text-slate-500 dark:text-slate-400">Select how you want to pay</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Select Method</label>
          <div className="space-y-4">
            <div className="flex items-center bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary transition-colors cursor-pointer">
              <input
                id="paypal"
                name="paymentMethod"
                type="radio"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-primary bg-slate-100 border-slate-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
              />
              <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-slate-900 dark:text-white cursor-pointer flex-1">
                PayPal or Credit Card
              </label>
            </div>
            
            {/* Additional payment methods can be added here following the same structure */}
            {/* <div className="flex items-center bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary transition-colors cursor-pointer">
              <input
                id="stripe"
                name="paymentMethod"
                type="radio"
                value="Stripe"
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-primary bg-slate-100 border-slate-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
              />
              <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-slate-900 dark:text-white cursor-pointer flex-1">
                Stripe
              </label>
            </div> */}
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary py-3.5 text-lg flex justify-center items-center gap-2 mt-8"
        >
          Continue
        </button>
      </form>
    </FormContainer>
  );
};

export default PaymentScreen;
