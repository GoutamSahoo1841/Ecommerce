import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfileMutation, useLogoutMutation, useGetUserProfileQuery } from '../slices/usersApiSlice';
import { setCredentials, logout } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart, enableBuyNow } from '../slices/cartSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Lock,
  ShoppingBag,
  Check,
  X,
  ArrowRight,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Camera,
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { toast } from 'react-toastify';
import { formatPrice, isValidIndianPhone, formatIndianPhone } from '../utils/currencyUtils';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [updateProfile, { isLoading }] = useProfileMutation();
  const [logoutApiCall] = useLogoutMutation();
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();
  const { data: profile } = useGetUserProfileQuery();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(-1);
  const [addrAddress, setAddrAddress] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrCountry, setAddrCountry] = useState('');

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setPhone(userInfo.phone || '');
      setBio(userInfo.bio || '');
    }
  }, [userInfo]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      toast.error('Failed to log out');
    }
  };

  const submitProfileHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (phone && phone.trim() && !isValidIndianPhone(phone)) {
      toast.error('Please enter a valid 10-digit Indian phone number (e.g. +91 98765 43210)');
      return;
    }
    try {
      const formattedPhone = phone ? formatIndianPhone(phone) : '';
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        phone: formattedPhone,
        bio,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update profile');
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addrAddress || !addrCity || !addrPostalCode || !addrCountry) {
      toast.error('Please fill in all address fields');
      return;
    }
    const newAddress = {
      address: addrAddress,
      city: addrCity,
      postalCode: addrPostalCode,
      country: addrCountry,
    };
    try {
      let updatedAddresses = [...(profile?.addresses || [])];
      if (editingAddressIndex >= 0) {
        updatedAddresses[editingAddressIndex] = newAddress;
      } else {
        updatedAddresses.push(newAddress);
      }
      await updateProfile({ addresses: updatedAddresses }).unwrap();
      toast.success(editingAddressIndex >= 0 ? 'Address updated' : 'Address added');
      setIsEditingAddress(false);
      setEditingAddressIndex(-1);
      setAddrAddress('');
      setAddrCity('');
      setAddrPostalCode('');
      setAddrCountry('');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (idx) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const updatedAddresses = (profile?.addresses || []).filter((_, i) => i !== idx);
        await updateProfile({ addresses: updatedAddresses }).unwrap();
        toast.success('Address deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to delete address');
      }
    }
  };

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const totalSpent = orders
    ? orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0)
    : 0;

  if (!userInfo) {
    return (
      <div className="min-h-screen pt-20">
        <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">Sign in to your account</h2>
          <p className="mt-2 text-muted-foreground">
            Access your orders, wishlist, and account settings.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 text-left">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">My Account</span>
        </motion.nav>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <motion.aside
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="rounded-2xl bg-card p-6 shadow-sm border border-border/50">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg font-bold">
                    {userInfo.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-foreground truncate">{userInfo.name}</h2>
                  <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsEditing(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
                <button
                  onClick={logoutHandler}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="rounded-2xl bg-card p-6 shadow-sm border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground text-sm">
                      Manage your personal information and password
                    </p>
                  </div>
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    onClick={() => (isEditing ? submitProfileHandler(new Event('submit')) : setIsEditing(true))}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>

                <Separator className="my-6" />

                <form onSubmit={submitProfileHandler} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl font-bold">
                        {userInfo.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{userInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Registered Member
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">Bio</label>
                      <Input
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tech lover"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h4 className="font-semibold text-sm text-foreground">Change Password</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">New Password</label>
                          <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep same"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Confirm New Password</label>
                          <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Leave blank to keep same"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </form>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-muted/50 p-4 text-center border border-border/40">
                    <p className="text-2xl font-bold text-foreground">{orders?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-4 text-center border border-border/40">
                    <p className="text-2xl font-bold text-foreground">{wishlistItems?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Wishlist Items</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-4 text-center border border-border/40">
                    <p className="text-2xl font-bold text-foreground">{formatPrice(totalSpent)}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="rounded-2xl bg-card p-6 shadow-sm border border-border/50 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Order History</h2>
                  <p className="text-sm text-muted-foreground">View and manage your recent orders</p>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-muted-foreground">Loading orders...</div>
                ) : errorOrders ? (
                  <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">{errorOrders?.data?.message || 'Failed to load orders'}</div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">You haven't placed any orders yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="py-3 px-4 font-semibold">ID</th>
                          <th className="py-3 px-4 font-semibold">Date</th>
                          <th className="py-3 px-4 font-semibold">Total</th>
                          <th className="py-3 px-4 font-semibold">Paid</th>
                          <th className="py-3 px-4 font-semibold">Delivered</th>
                          <th className="py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-muted/30">
                            <td className="py-4 px-4 font-mono font-medium text-xs text-foreground">
                              {order._id.substring(0, 10).toUpperCase()}
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">
                              {order.createdAt.substring(0, 10)}
                            </td>
                            <td className="py-4 px-4 font-bold text-foreground">
                              {formatPrice(order.totalPrice)}
                            </td>
                            <td className="py-4 px-4">
                              {order.isPaid ? (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">Paid</Badge>
                              ) : (
                                <Badge variant="outline" className="text-destructive">Pending</Badge>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {order.isDelivered ? (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">Delivered</Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">Processing</Badge>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/order/${order._id}`}>Details</Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="rounded-2xl bg-card p-6 shadow-sm border border-border/50 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Saved Wishlist Items</h2>
                  <p className="text-sm text-muted-foreground">Items you've saved for later</p>
                </div>
                {wishlistItems && wishlistItems.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                      <div key={item._id} className="flex flex-col justify-between p-4 rounded-xl bg-muted/40 border border-border/40">
                        <div className="flex gap-3">
                          <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-lg" />
                          <div>
                            <h4 className="font-semibold text-sm text-foreground line-clamp-1">{item.name}</h4>
                            <p className="text-sm font-bold text-foreground mt-1">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" className="flex-1" onClick={() => dispatch(addToCart({ ...item, qty: 1 }))}>Add to Cart</Button>
                          <Button size="sm" variant="outline" onClick={() => dispatch(removeFromWishlist(item._id))}>Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No items in your wishlist.</div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="rounded-2xl bg-card p-6 shadow-sm border border-border/50 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Saved Addresses</h2>
                    <p className="text-sm text-muted-foreground">Manage your shipping and billing locations</p>
                  </div>
                  {!isEditingAddress && (
                    <Button size="sm" onClick={() => { setIsEditingAddress(true); setEditingAddressIndex(-1); setAddrAddress(''); setAddrCity(''); setAddrPostalCode(''); setAddrCountry(''); }}>Add Address</Button>
                  )}
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4 max-w-md">
                    <Input placeholder="Address" value={addrAddress} onChange={(e) => setAddrAddress(e.target.value)} required />
                    <Input placeholder="City" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} required />
                    <Input placeholder="Postal Code" value={addrPostalCode} onChange={(e) => setAddrPostalCode(e.target.value)} required />
                    <Input placeholder="Country" value={addrCountry} onChange={(e) => setAddrCountry(e.target.value)} required />
                    <div className="flex gap-2">
                      <Button type="submit">Save Address</Button>
                      <Button variant="outline" onClick={() => setIsEditingAddress(false)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profile?.addresses?.map((addr, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-2">
                        <h4 className="font-semibold text-sm text-foreground">Address #{idx + 1}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{addr.address}, {addr.city}, {addr.postalCode}, {addr.country}</p>
                        <div className="flex gap-2 pt-2">
                          <Button variant="ghost" size="sm" onClick={() => { setAddrAddress(addr.address); setAddrCity(addr.city); setAddrPostalCode(addr.postalCode); setAddrCountry(addr.country); setEditingAddressIndex(idx); setIsEditingAddress(true); }}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteAddress(idx)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
