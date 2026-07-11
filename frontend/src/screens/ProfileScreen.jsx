import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileMutation, useLogoutMutation, useGetUserProfileQuery } from '../slices/usersApiSlice';
import { setCredentials, logout } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart, enableBuyNow } from '../slices/cartSlice';
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
  ArrowRight,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Settings,
  LogOut,
  Calendar,
  Phone
} from 'lucide-react';
import { toast } from 'react-toastify';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [updateProfile, { isLoading }] = useProfileMutation();
  const [logoutApiCall] = useLogoutMutation();

  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

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
      window.location.href = '/';
    } catch (err) {
      toast.error('Failed to log out');
      console.error(err);
    }
  };

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
        phone,
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

  // Address edit state hooks and handlers
  const { data: profile, isLoading: loadingProfile } = useGetUserProfileQuery();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(-1);
  const [addrAddress, setAddrAddress] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrCountry, setAddrCountry] = useState('');

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
      toast.success(editingAddressIndex >= 0 ? 'Address updated successfully' : 'Address added successfully');

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
        toast.success('Address deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to delete address');
      }
    }
  };

  const handleStartEdit = (addr, idx) => {
    setAddrAddress(addr.address);
    setAddrCity(addr.city);
    setAddrPostalCode(addr.postalCode);
    setAddrCountry(addr.country);
    setEditingAddressIndex(idx);
    setIsEditingAddress(true);
  };

  const handleStartAdd = () => {
    setAddrAddress('');
    setAddrCity('');
    setAddrPostalCode('');
    setAddrCountry('');
    setEditingAddressIndex(-1);
    setIsEditingAddress(true);
  };

  // Calculate stats
  const totalSpent = orders
    ? orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0)
    : 0;

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

  const getInitials = (userName) => {
    if (!userName) return 'U';
    return userName
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
        <span>&gt;</span>
        <span className="text-foreground font-semibold">My Account</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <Card className="shadow-sm border border-border/50 rounded-2xl bg-card overflow-hidden">
            <CardContent className="p-6 space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-border/40">
                <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-foreground text-base border border-border/30 shadow-inner">
                  {getInitials(userInfo?.name)}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h2 className="font-bold text-foreground truncate text-sm sm:text-base">{userInfo?.name}</h2>
                  <p className="text-xs text-muted-foreground truncate">{userInfo?.email}</p>
                </div>
              </div>

              {/* Sidebar Tabs */}
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
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                        }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {item.label}
                    </button>
                  );
                })}

                <button
                  onClick={logoutHandler}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Sign Out
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Tab Panel */}
        <div className="lg:col-span-9">
          <Card className="shadow-sm border border-border/50 rounded-2xl bg-card">
            <CardContent className="p-6 sm:p-8">

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between pb-5 border-b border-border/40">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
                      <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (isEditing) {
                          setIsEditing(false);
                          setName(userInfo.name || '');
                          setEmail(userInfo.email || '');
                          setPhone(userInfo.phone || '');
                          setBio(userInfo.bio || '');
                          setPassword('');
                          setConfirmPassword('');
                        } else {
                          setIsEditing(true);
                        }
                      }}
                      className="rounded-full px-4.5 py-1.5 text-xs font-semibold border-border/80 hover:bg-secondary transition-all h-8.5"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>

                  {/* Horizontal Banner user card */}
                  <div className="flex items-center gap-4 py-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/85 flex items-center justify-center font-extrabold text-xl text-foreground/80 shadow-sm border border-border/40">
                      {getInitials(name)}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-foreground">{name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                        Member since {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'January 2024'}
                      </p>
                    </div>
                  </div>

                  {/* Profile Edit/View Form */}
                  <form onSubmit={submitHandler} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-foreground">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          disabled={!isEditing}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-secondary/30 disabled:bg-secondary/15 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:text-foreground/80 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-foreground">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled={!isEditing}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-secondary/30 disabled:bg-secondary/15 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:text-foreground/80 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-foreground">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={phone}
                        disabled={!isEditing}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-secondary/30 disabled:bg-secondary/15 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50 disabled:text-foreground/80 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-foreground">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        disabled={!isEditing}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tech enthusiast and gadget lover."
                        rows={3}
                        className="w-full bg-secondary/30 disabled:bg-secondary/15 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50 disabled:text-foreground/80 disabled:cursor-not-allowed resize-none"
                      />
                    </div>

                    {isEditing && (
                      <div className="border-t border-border/40 pt-5 space-y-5">
                        <h4 className="text-sm font-bold text-foreground">Security Updates</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                              className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
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
                              className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setName(userInfo.name || '');
                            setEmail(userInfo.email || '');
                            setPhone(userInfo.phone || '');
                            setBio(userInfo.bio || '');
                            setPassword('');
                            setConfirmPassword('');
                          }}
                          className="rounded-xl px-4"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="rounded-xl px-6 text-white font-semibold"
                        >
                          {isLoading ? 'Saving...' : 'Save Updates'}
                        </Button>
                      </div>
                    )}
                  </form>

                  {/* Stats Cards Section at bottom */}
                  {!isEditing && (
                    <div className="border-t border-border/40 pt-6 mt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-secondary/25 dark:bg-secondary/5 rounded-2xl p-5 text-center space-y-0.5 border border-border/10">
                          <span className="block text-2xl font-extrabold text-foreground">{orders?.length || 0}</span>
                          <span className="block text-xs font-semibold text-muted-foreground">Total Orders</span>
                        </div>

                        <div className="bg-secondary/25 dark:bg-secondary/5 rounded-2xl p-5 text-center space-y-0.5 border border-border/10">
                          <span className="block text-2xl font-extrabold text-foreground">{wishlistItems?.length || 0}</span>
                          <span className="block text-xs font-semibold text-muted-foreground">Wishlist Items</span>
                        </div>

                        <div className="bg-secondary/25 dark:bg-secondary/5 rounded-2xl p-5 text-center space-y-0.5 border border-border/10">
                          <span className="block text-2xl font-extrabold text-foreground">${totalSpent.toFixed(0)}</span>
                          <span className="block text-xs font-semibold text-muted-foreground">Total Spent</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">My Orders</h2>
                    <p className="text-sm text-muted-foreground mt-1">View your order history and details</p>
                  </div>

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
                      <Button asChild size="sm" className="rounded-xl text-white">
                        <Link to="/">Shop Now</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto scrollbar-hide -mx-6">
                      <table className="w-full text-left border-collapse min-w-[600px] text-sm">
                        <thead>
                          <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider bg-secondary/10">
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
                </div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">My Wishlist</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your saved items</p>
                  </div>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground space-y-4">
                      <Heart className="h-10 w-10 text-muted-foreground/20 mx-auto" />
                      <p className="text-sm">Your wishlist is empty.</p>
                      <Button asChild size="sm" className="rounded-xl text-white">
                        <Link to="/">Shop Now</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {wishlistItems.map((item) => (
                        <Card key={item._id} className="overflow-hidden shadow-sm relative group border border-border/40 rounded-2xl bg-card">
                          <button
                            onClick={() => {
                              dispatch(removeFromWishlist(item._id));
                              toast.success('Removed from wishlist');
                            }}
                            className="absolute top-3 right-3 z-10 w-8 h-8 bg-card/85 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 rounded-full flex items-center justify-center shadow-sm border border-border/40 transition-colors focus:outline-none"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <Link to={`/product/${item._id}`} className="block relative aspect-square overflow-hidden bg-secondary/20">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>

                          <div className="p-4 flex flex-col justify-between h-[130px]">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.brand}</span>
                              <Link to={`/product/${item._id}`}>
                                <h3 className="text-xs font-bold text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug">
                                  {item.name}
                                </h3>
                              </Link>
                            </div>
                            <div className="flex items-center justify-between border-t border-border/20 pt-3">
                              <span className="text-sm font-extrabold text-foreground">${item.price}</span>
                              {item.countInStock > 0 ? (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      dispatch(enableBuyNow({ ...item, qty: 1 }));
                                      navigate('/shipping');
                                    }}
                                    size="sm"
                                    className="rounded-xl text-[10px] h-8 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 font-semibold"
                                  >
                                    Buy Now
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      dispatch(addToCart({ ...item, qty: 1 }));
                                      toast.success(`Added ${item.name} to cart`);
                                    }}
                                    size="sm"
                                    className="rounded-xl text-[10px] h-8 text-white px-2.5 font-semibold"
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  disabled
                                  size="sm"
                                  className="rounded-xl text-[10px] h-8 text-muted-foreground px-3 font-semibold"
                                >
                                  Out of Stock
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-5 border-b border-border/40">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">My Addresses</h2>
                      <p className="text-sm text-muted-foreground mt-1">Manage your delivery and billing addresses</p>
                    </div>
                    {!isEditingAddress && (
                      <Button size="sm" onClick={handleStartAdd} className="rounded-xl text-white font-semibold">
                        Add New
                      </Button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <form onSubmit={handleSaveAddress} className="space-y-4 p-5 bg-secondary/10 border border-border/50 rounded-2xl max-w-lg">
                      <h3 className="text-sm font-bold text-foreground mb-3 pb-1 border-b border-border/20">
                        {editingAddressIndex >= 0 ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground">Address</label>
                        <input
                          type="text"
                          placeholder="Enter address"
                          value={addrAddress}
                          onChange={(e) => setAddrAddress(e.target.value)}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground">City</label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground">Postal Code</label>
                        <input
                          type="text"
                          placeholder="Enter postal code"
                          value={addrPostalCode}
                          onChange={(e) => setAddrPostalCode(e.target.value)}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground">Country</label>
                        <input
                          type="text"
                          placeholder="Enter country"
                          value={addrCountry}
                          onChange={(e) => setAddrCountry(e.target.value)}
                          className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                          required
                        />
                      </div>
                      <div className="flex gap-2.5 pt-2">
                        <Button type="submit" size="sm" className="rounded-xl text-white font-semibold">
                          Save Address
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingAddress(false)}
                          className="rounded-xl font-semibold border-border hover:bg-secondary/40 text-foreground"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {profile?.addresses && profile.addresses.map((addr, idx) => (
                        <div key={idx} className="border border-border/50 bg-secondary/15 rounded-2xl p-5 relative space-y-3.5">
                          {idx === 0 && (
                            <span className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Default</span>
                          )}
                          <h4 className="font-bold text-sm text-foreground">{userInfo?.name} (Option #{idx + 1})</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {addr.address}<br />
                            {addr.city}, {addr.postalCode}<br />
                            {addr.country}
                          </p>
                          <div className="flex gap-2 pt-2 border-t border-border/10">
                            <button
                              onClick={() => handleStartEdit(addr, idx)}
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              Edit
                            </button>
                            <span className="text-muted-foreground/30 text-xs">|</span>
                            <button
                              onClick={() => handleDeleteAddress(idx)}
                              className="text-xs font-bold text-muted-foreground hover:text-foreground"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}

                      <div
                        onClick={handleStartAdd}
                        className="border border-border/50 rounded-2xl p-5 space-y-3.5 flex flex-col justify-center items-center py-10 text-center text-muted-foreground hover:bg-secondary/10 transition-all border-dashed cursor-pointer"
                      >
                        <MapPin className="h-7 w-7 text-muted-foreground/45" />
                        <p className="text-xs font-semibold">Add a secondary address</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PAYMENT TAB */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-5 border-b border-border/40">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
                      <p className="text-sm text-muted-foreground mt-1">Manage your saved credit and debit cards</p>
                    </div>
                    <Button size="sm" className="rounded-xl text-white font-semibold">
                      Add Card
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="border border-border/50 bg-secondary/15 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-muted-foreground">Visa Ending in 4242</span>
                          <h4 className="font-bold text-sm text-foreground">{userInfo?.name}</h4>
                        </div>
                        <CreditCard className="h-6 w-6 text-foreground/50" />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">Expires 12/28</span>
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Default</span>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-border/10">
                        <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                        <span className="text-muted-foreground/30 text-xs">|</span>
                        <button className="text-xs font-bold text-muted-foreground hover:text-foreground">Delete</button>
                      </div>
                    </div>

                    <div className="border border-border/50 rounded-2xl p-5 flex flex-col justify-center items-center py-10 text-center text-muted-foreground hover:bg-secondary/10 transition-all border-dashed cursor-pointer">
                      <CreditCard className="h-7 w-7 text-muted-foreground/45" />
                      <p className="text-xs font-semibold">Add a new payment card</p>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="pb-5 border-b border-border/40">
                    <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
                    <p className="text-sm text-muted-foreground mt-1">Configure your email and sms alert preferences</p>
                  </div>

                  <div className="border border-border/40 rounded-2xl divide-y divide-border/30 bg-card overflow-hidden">
                    <div className="p-5 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                      <div className="space-y-1 pr-4">
                        <h4 className="font-bold text-sm text-foreground">Order Updates</h4>
                        <p className="text-xs text-muted-foreground">Receive confirmation email, invoices, and shipping details instantly.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4.5 w-4.5 accent-primary rounded cursor-pointer transition-colors" />
                    </div>

                    <div className="p-5 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                      <div className="space-y-1 pr-4">
                        <h4 className="font-bold text-sm text-foreground">Promotions and Marketing</h4>
                        <p className="text-xs text-muted-foreground">Hear first about holiday deals, clearance sales, and new arrivals.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4.5 w-4.5 accent-primary rounded cursor-pointer transition-colors" />
                    </div>

                    <div className="p-5 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                      <div className="space-y-1 pr-4">
                        <h4 className="font-bold text-sm text-foreground">Tech Newsletter</h4>
                        <p className="text-xs text-muted-foreground">Get weekly digests on gadget releases, technology articles, and tutorials.</p>
                      </div>
                      <input type="checkbox" className="h-4.5 w-4.5 accent-primary rounded cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="pb-5 border-b border-border/40">
                    <h2 className="text-2xl font-bold text-foreground">Security Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">Update passwords and secure access</p>
                  </div>

                  <form onSubmit={submitHandler} className="border border-border/40 rounded-2xl p-6 space-y-5 max-w-xl bg-secondary/10">
                    <h3 className="text-sm font-bold text-foreground">Change Password</h3>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5" />
                        New Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-card border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
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
                        placeholder="Confirm new password"
                        className="w-full bg-card border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-xl px-6 text-white font-semibold"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="pb-5 border-b border-border/40">
                    <h2 className="text-2xl font-bold text-foreground">Account Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">Configure language, currency, and global preferences</p>
                  </div>

                  <div className="border border-border/40 rounded-2xl p-6 space-y-5 max-w-xl bg-card">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-foreground">Preferred Currency</label>
                      <select className="w-full bg-secondary/40 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="gbp">GBP (£)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-foreground">Language</label>
                      <select className="w-full bg-secondary/40 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div className="pt-5 border-t border-border/20 space-y-3.5">
                      <h4 className="text-sm font-bold text-rose-600">Danger Zone</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">Once you delete your account, there is no going back. All order histories, wishlists, and user data will be permanently wiped.</p>
                      <Button variant="destructive" className="rounded-xl h-9 text-xs px-4">
                        Delete Account
                      </Button>
                    </div>
                  </div>
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
