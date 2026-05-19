import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="flex justify-center mt-12 mb-20">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
