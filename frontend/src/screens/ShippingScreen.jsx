import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import { Button } from '../components/ui/Button';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Shipping</h1>
        <p className="text-sm text-muted-foreground">Enter your delivery details</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">Address</label>
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">City</label>
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">Postal Code</label>
          <input
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">Country</label>
          <input
            type="text"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full shadow-md text-white font-bold h-11"
        >
          Continue
        </Button>
      </form>
    </FormContainer>
  );
};

export default ShippingScreen;
