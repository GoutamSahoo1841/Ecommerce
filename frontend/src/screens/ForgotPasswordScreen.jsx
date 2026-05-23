import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.data);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 w-full max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 text-center">Forgot Password</h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
          Enter your email address and we will send you a link to reset your password.
        </p>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
