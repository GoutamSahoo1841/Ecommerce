import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Button } from '../components/ui/Button';
import { User, ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      if (res.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      // Handled by mutation hook
    }
  };

  if (!showForm) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 space-y-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f0f4f9] dark:bg-secondary mx-auto">
          <User className="h-12 w-12 text-[#5f6368] dark:text-muted-foreground/80" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Sign in to your account</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Access your orders, wishlist, and account settings.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Button 
            onClick={() => setShowForm(true)} 
            className="rounded-xl px-6 text-white font-semibold h-10 bg-primary hover:bg-primary/90"
          >
            Sign In
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(redirect ? `/admin/login?redirect=${redirect}` : '/admin/login')} 
            className="rounded-xl px-6 font-semibold h-10 border-border/80 bg-background hover:bg-secondary/60"
          >
            Admin Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-12 mb-20 px-4">
      <div className="w-full max-w-md bg-card border border-border/50 p-8 sm:p-10 rounded-3xl shadow-lg relative">
        {/* Back Button */}
        <button 
          onClick={() => setShowForm(false)} 
          className="absolute top-6 left-6 text-muted-foreground hover:text-foreground p-1 transition-colors rounded-full hover:bg-secondary/60"
          title="Go Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Close Button */}
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 right-6 text-muted-foreground/60 hover:text-foreground p-1 transition-colors rounded-full hover:bg-secondary/60"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8 mt-6">
          <span className="text-xl font-bold tracking-wider text-foreground">NOVA</span>
          <h1 className="text-2xl font-extrabold text-foreground mt-4">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access your account</p>
        </div>

        {error && (
          <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs text-center font-semibold">
            {error?.data?.message || error.error || 'Invalid credentials'}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-muted-foreground/55 h-4.5 w-4.5" />
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card border border-border/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-muted-foreground/55 h-4.5 w-4.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-card border border-border/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-muted-foreground/55 hover:text-foreground p-0.5 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center gap-2 font-medium text-muted-foreground cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/25 cursor-pointer accent-primary" 
              />
              Remember me
            </label>
            <Link to="/forgotpassword" className="text-primary hover:underline font-semibold">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 rounded-xl shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-border/30"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-border/30"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info('Google Sign-In is a mockup demo')}
            className="rounded-xl border-border/80 hover:bg-secondary/45 font-semibold text-xs py-2.5 flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info('GitHub Sign-In is a mockup demo')}
            className="rounded-xl border-border/80 hover:bg-secondary/45 font-semibold text-xs py-2.5 flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </Button>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground font-semibold">
          Don't have an account?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-primary font-bold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
