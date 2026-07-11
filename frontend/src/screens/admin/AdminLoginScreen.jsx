import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { useAdminLoginMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { Button } from '../../components/ui/Button';

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [adminLogin, { isLoading, error }] = useAdminLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/admin/dashboard';

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/admin/dashboard');
    } catch (err) {
      // Handled by mutation hook
    }
  };

  return (
    <FormContainer>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Admin Portal</h1>
        <p className="text-sm text-muted-foreground font-medium">Verify credentials to manage your store</p>
      </div>

      {error && (
        <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs text-center font-semibold">
          {error?.data?.message || error.error || 'Invalid admin credentials'}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-foreground">Admin Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-foreground">Password</label>
          <input
            type="password"
            placeholder="••••••••"
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
            'Admin Sign In'
          )}
        </Button>
      </form>
    </FormContainer>
  );
};

export default AdminLoginScreen;
