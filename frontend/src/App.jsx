import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBox from './components/ChatBox';

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let socket;

    // Connect to socket if user is admin
    if (userInfo && userInfo.isAdmin) {
      // Create socket connection
      // For local development it connects to the same host
      socket = io(window.location.origin === 'http://localhost:5173' ? 'http://localhost:5000' : '/');

      // Join admin room
      socket.emit('join_admin');

      // Listen for new orders
      socket.on('newOrder', (order) => {
        toast.info(`🔔 New Order Alert! Order ID: ${order._id} for $${order.totalPrice}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userInfo]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-15 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="py-8 min-h-[80vh]">
            <Outlet />
          </main>
        </div>
      </main>
      <Footer />
      <ChatBox />
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default App;
