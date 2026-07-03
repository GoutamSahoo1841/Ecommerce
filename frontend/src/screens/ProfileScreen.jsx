import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  User, 
  Mail, 
  Lock, 
  ShoppingBag, 
  Check, 
  X,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useProfileMutation();

  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile information and view order history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center pb-4 border-b border-border/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-2xl mb-3 shadow-inner">
                  {userInfo?.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-bold text-foreground">{userInfo?.name}</h2>
                <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
              </div>

              <form onSubmit={submitHandler} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full shadow-md text-white font-bold h-11"
                >
                  {isLoading ? 'Updating...' : 'Save Updates'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Orders Card */}
        <div className="lg:col-span-8">
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-foreground border-b border-border/50 pb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                My Orders
              </h2>

              {loadingOrders ? (
                <div className="flex flex-col justify-center items-center py-20 text-muted-foreground text-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3" />
                  Loading Orders...
                </div>
              ) : errorOrders ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
                  {errorOrders?.data?.message || errorOrders.error || 'Failed to load orders'}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground space-y-4">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/20 mx-auto" />
                  <p className="text-sm">You haven't placed any orders yet.</p>
                  <Button asChild size="sm">
                    <Link to="/">Shop Now</Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide -mx-6">
                  <table className="w-full text-left border-collapse min-w-[600px] text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider bg-secondary/20">
                        <th className="py-3 px-6 font-semibold">ID</th>
                        <th className="py-3 px-6 font-semibold">Date</th>
                        <th className="py-3 px-6 font-semibold">Total</th>
                        <th className="py-3 px-6 font-semibold text-center">Paid</th>
                        <th className="py-3 px-6 font-semibold text-center">Delivered</th>
                        <th className="py-3 px-6 font-semibold"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-secondary/10 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-xs text-foreground">
                            {order._id.substring(0, 10).toUpperCase()}...
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {order.createdAt.substring(0, 10)}
                          </td>
                          <td className="py-4 px-6 font-bold text-foreground">
                            ${order.totalPrice.toFixed(2)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {order.isPaid ? (
                              <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-500 py-1 font-semibold flex items-center justify-center gap-1 mx-auto max-w-[90px]">
                                <Check className="h-3 w-3" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-rose-500/20 bg-rose-500/5 text-rose-500 py-1 font-semibold flex items-center justify-center gap-1 mx-auto max-w-[90px]">
                                <X className="h-3 w-3" />
                                No
                              </Badge>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {order.isDelivered ? (
                              <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-500 py-1 font-semibold flex items-center justify-center gap-1 mx-auto max-w-[90px]">
                                <Check className="h-3 w-3" />
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-rose-500/20 bg-rose-500/5 text-rose-500 py-1 font-semibold flex items-center justify-center gap-1 mx-auto max-w-[90px]">
                                <X className="h-3 w-3" />
                                No
                              </Badge>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button variant="ghost" size="sm" asChild className="rounded-xl">
                              <Link to={`/order/${order._id}`} className="flex items-center gap-1">
                                Details
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
