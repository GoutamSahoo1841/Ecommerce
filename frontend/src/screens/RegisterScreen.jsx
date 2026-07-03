import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Button } from '../components/ui/Button';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();

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
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setMessage(null);
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      // Handled by mutation hook
    }
  };

  return (
    <FormContainer>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Create Account</h1>
        <p className="text-sm text-muted-foreground">Join us to get started</p>
      </div>

      {message && (
        <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs text-center">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs text-center">
          {error?.data?.message || error.error || 'Registration failed'}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-muted-foreground">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
          />
        </div>

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
          <label className="block text-xs font-semibold text-muted-foreground">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-muted-foreground">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            'Register'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-primary font-bold hover:underline">
          Login Here
        </Link>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;
