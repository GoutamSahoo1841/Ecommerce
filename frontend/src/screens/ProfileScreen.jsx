import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading, error }] = useProfileMutation();

  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSuccessMsg(null);
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
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
      setSuccessMsg('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Error is handled by RTK query state
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">User Profile</h2>
          
          {message && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl border border-red-200 dark:border-red-800 text-sm">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl border border-red-200 dark:border-red-800 text-sm">
              {error?.data?.message || error.error || 'Update failed'}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-500 p-4 rounded-xl border border-green-200 dark:border-green-800 text-sm">
              {successMsg}
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 text-lg flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Update'
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Orders</h2>
          {loadingOrders ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
            </div>
          ) : errorOrders ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl border border-red-200 dark:border-red-800 text-sm">
              {errorOrders?.data?.message || errorOrders.error || 'Failed to load orders'}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-semibold px-4">ID</th>
                    <th className="pb-4 font-semibold px-4">Date</th>
                    <th className="pb-4 font-semibold px-4">Total</th>
                    <th className="pb-4 font-semibold px-4 text-center">Paid</th>
                    <th className="pb-4 font-semibold px-4 text-center">Delivered</th>
                    <th className="pb-4 font-semibold px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-slate-900 dark:text-white">{order._id.substring(0, 10)}...</td>
                      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300">{order.createdAt.substring(0, 10)}</td>
                      <td className="py-4 px-4 text-sm font-medium text-slate-900 dark:text-white">${order.totalPrice}</td>
                      <td className="py-4 px-4 text-center">
                        {order.isPaid ? (
                          <div className="inline-flex flex-col items-center justify-center">
                            <span className="text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                            <span className="text-[10px] text-slate-500">{order.paidAt.substring(0, 10)}</span>
                          </div>
                        ) : (
                          <span className="inline-flex text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {order.isDelivered ? (
                          <div className="inline-flex flex-col items-center justify-center">
                            <span className="text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                            <span className="text-[10px] text-slate-500">{order.deliveredAt.substring(0, 10)}</span>
                          </div>
                        ) : (
                          <span className="inline-flex text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link to={`/order/${order._id}`} className="text-primary hover:text-primary-dark font-medium text-sm hover:underline">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
