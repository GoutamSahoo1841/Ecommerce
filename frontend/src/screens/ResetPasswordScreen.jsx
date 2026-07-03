import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import { Button } from '../components/ui/Button';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await resetPassword({ token, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Password reset successful');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to reset password');
    }
  };

  return (
    <FormContainer>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Reset Password</h1>
        <p className="text-sm text-muted-foreground">Enter and confirm your new password below.</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            placeholder="Enter new password"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-muted-foreground">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            placeholder="Confirm new password"
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
            'Reset Password'
          )}
        </Button>
      </form>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
