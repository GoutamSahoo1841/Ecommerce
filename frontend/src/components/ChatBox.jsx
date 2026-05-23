import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const ENDPOINT = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';

const ChatBox = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    // Only initialize socket if user is NOT an admin (admins have their own screen)
    if (!userInfo?.isAdmin) {
      const sk = io(ENDPOINT);
      setSocket(sk);

      sk.emit('join_user', {
        _id: userInfo ? userInfo._id : sk.id,
        name: userInfo ? userInfo.name : 'Guest',
      });

      sk.on('message', (data) => {
        setMessages((msgs) => [...msgs, data]);
      });

      return () => {
        sk.disconnect();
      };
    }
  }, [userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim() || !socket) return;

    const msg = {
      body: messageBody,
      name: userInfo ? userInfo.name : 'Guest',
      isAdmin: false,
    };

    setMessages([...messages, msg]);
    socket.emit('user_message', msg);
    setMessageBody('');
  };

  if (userInfo?.isAdmin) {
    return null; // Admins use the AdminChatScreen
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-800 w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col h-[500px] overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold">Live Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-slate-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 text-sm mt-10">
                Welcome! How can we help you today?
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">{msg.name}</span>
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                    msg.isAdmin 
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-tl-sm' 
                      : 'bg-primary text-white rounded-tr-sm'
                  }`}>
                    {msg.body}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={submitHandler} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <input 
              type="text" 
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
            />
            <button type="submit" disabled={!messageBody.trim()} className="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};

export default ChatBox;
