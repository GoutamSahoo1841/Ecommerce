import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { Button } from '../components/ui/Button';

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
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Payment Method</h1>
        <p className="text-sm text-muted-foreground">Select how you want to pay</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-4">Select Method</label>
          <div className="space-y-3">
            <div 
              onClick={() => setPaymentMethod('PayPal')}
              className={`flex items-center bg-card p-4 border rounded-xl hover:border-primary transition-colors cursor-pointer select-none ${
                paymentMethod === 'PayPal' ? 'border-primary bg-primary/5' : 'border-border/50'
              }`}
            >
              <input
                id="paypal"
                name="paymentMethod"
                type="radio"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-primary bg-secondary border-border/50 focus:ring-primary/30 cursor-pointer"
              />
              <label htmlFor="paypal" className="ml-3 block text-sm font-semibold text-foreground cursor-pointer flex-1">
                PayPal or Credit Card
              </label>
            </div>

            <div 
              onClick={() => setPaymentMethod('COD')}
              className={`flex items-center bg-card p-4 border rounded-xl hover:border-primary transition-colors cursor-pointer select-none ${
                paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border/50'
              }`}
            >
              <input
                id="cod"
                name="paymentMethod"
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-primary bg-secondary border-border/50 focus:ring-primary/30 cursor-pointer"
              />
              <label htmlFor="cod" className="ml-3 block text-sm font-semibold text-foreground cursor-pointer flex-1">
                Cash on Delivery (COD)
              </label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full shadow-md text-white font-bold h-11 mt-6"
        >
          Continue
        </Button>
      </form>
    </FormContainer>
  );
};

export default PaymentScreen;
