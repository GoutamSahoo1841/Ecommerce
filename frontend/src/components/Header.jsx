import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 flex items-center gap-2">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              E-Shop
            </Link>
          </div>
          
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBox />
          </div>

          <div className="flex items-center gap-6">
            <Link to="/wishlist" className="text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors relative group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {wishlistItems && wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-darker">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors relative group">
              <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-darker">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium focus:outline-none"
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:block">{userInfo.name}</span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg py-2 border border-slate-100 dark:border-slate-700">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary transition-colors" onClick={() => setDropdownOpen(false)}>
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        logoutHandler();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-red-500 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="hidden sm:block">Sign In</span>
              </Link>
            )}
            
            {userInfo && userInfo.isAdmin && (
              <div className="relative">
                <button 
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium focus:outline-none ml-2"
                >
                  <span>Admin</span>
                  <svg className={`w-4 h-4 transition-transform ${adminDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {adminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg py-2 border border-slate-100 dark:border-slate-700">
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary transition-colors" onClick={() => setAdminDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/admin/productlist" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary transition-colors" onClick={() => setAdminDropdownOpen(false)}>
                      Products
                    </Link>
                    <Link to="/admin/userlist" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary transition-colors" onClick={() => setAdminDropdownOpen(false)}>
                      Users
                    </Link>
                    <Link to="/admin/orderlist" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary transition-colors" onClick={() => setAdminDropdownOpen(false)}>
                      Orders
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
