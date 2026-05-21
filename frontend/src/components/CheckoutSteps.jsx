import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex justify-center mb-8">
      <ul className="flex items-center space-x-2 sm:space-x-4">
        {/* Step 1: Sign In */}
        <li className="flex items-center">
          {step1 ? (
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Sign In</span>
          )}
        </li>
        <li className="text-slate-300 dark:text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </li>

        {/* Step 2: Shipping */}
        <li className="flex items-center">
          {step2 ? (
            <Link to="/shipping" className="text-primary font-bold hover:underline">
              Shipping
            </Link>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Shipping</span>
          )}
        </li>
        <li className="text-slate-300 dark:text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </li>

        {/* Step 3: Payment */}
        <li className="flex items-center">
          {step3 ? (
            <Link to="/payment" className="text-primary font-bold hover:underline">
              Payment
            </Link>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Payment</span>
          )}
        </li>
        <li className="text-slate-300 dark:text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </li>

        {/* Step 4: Place Order */}
        <li className="flex items-center">
          {step4 ? (
            <Link to="/placeorder" className="text-primary font-bold hover:underline">
              Place Order
            </Link>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Place Order</span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default CheckoutSteps;
