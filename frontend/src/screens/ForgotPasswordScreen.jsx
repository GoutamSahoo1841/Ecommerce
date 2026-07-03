import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';
import { Button } from '../components/ui/Button';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.data || 'Password reset email sent');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to send reset link');
    }
  };

  return (
    <FormContainer>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            placeholder="Enter your email"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full shadow-md text-white font-bold h-11"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="text-xs text-primary font-bold hover:underline">
          Back to Login
        </Link>
      </div>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
