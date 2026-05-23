import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  useGetUserDetailsQuery, 
  useUpdateUserMutation 
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      alert('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      console.error(err?.data?.message || err.error);
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/admin/userlist" 
        className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Users
      </Link>

      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Edit User</h1>

        {loadingUpdate && (
          <div className="flex justify-center items-center py-4 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-xl flex items-center space-x-3 mb-6">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error?.data?.message || error.error}</span>
          </div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-3 py-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-5 h-5 bg-slate-900 border border-slate-700 rounded text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800 transition-colors cursor-pointer"
              />
              <label htmlFor="isAdmin" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                Is Admin
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 mt-8 shadow-lg shadow-indigo-600/30"
            >
              Update User
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditScreen;
