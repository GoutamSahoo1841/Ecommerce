import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Button } from '../components/ui/Button';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      // Handled by mutation hook
    }
  };

  return (
    <FormContainer>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs text-center">
          {error?.data?.message || error.error || 'Invalid credentials'}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-muted-foreground">Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold text-muted-foreground">Password</label>
            <Link to="/forgotpassword" className="text-xs text-primary hover:underline font-semibold">Forgot password?</Link>
          </div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
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
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        New Customer?{' '}
        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-primary font-bold hover:underline">
          Register Here
        </Link>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;
