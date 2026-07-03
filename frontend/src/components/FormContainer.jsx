import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="flex justify-center mt-12 mb-20 px-4">
      <div className="w-full max-w-md bg-card border border-border/50 p-8 sm:p-10 rounded-3xl shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
