import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { name: 'Sign In', active: step1, link: '/login' },
    { name: 'Shipping', active: step2, link: '/shipping' },
    { name: 'Payment', active: step3, link: '/payment' },
    { name: 'Place Order', active: step4, link: '/placeorder' },
  ];

  return (
    <nav className="flex justify-center mb-12">
      <div className="flex items-center w-full max-w-xl">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <React.Fragment key={step.name}>
              {/* Step circle */}
              <div className="flex flex-col items-center relative flex-1">
                {step.active ? (
                  <Link 
                    to={step.link} 
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all text-xs font-bold"
                  >
                    {idx + 1}
                  </Link>
                ) : (
                  <div 
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground text-xs font-bold cursor-not-allowed"
                  >
                    {idx + 1}
                  </div>
                )}
                <span className={`absolute top-11 text-xs font-medium whitespace-nowrap ${
                  step.active ? 'text-foreground font-bold' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </span>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div className={`h-0.5 flex-1 -mt-5 transition-all duration-300 ${
                  steps[idx + 1].active ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default CheckoutSteps;
