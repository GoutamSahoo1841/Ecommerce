import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const ENDPOINT = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';

const AdminChatScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]); // Array of { socketId, msg: {body, name, isAdmin} }
  const [messageBody, setMessageBody] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const sk = io(ENDPOINT);
      setSocket(sk);

      sk.emit('join_admin');

      sk.on('update_active_chats', (users) => {
        setActiveUsers(users);
        // If selected user disconnected, clear selection
        setSelectedUser((prev) => {
          if (prev && !users.find(u => u.socketId === prev.socketId)) {
            return null;
          }
          return prev;
        });
      });

      sk.on('message', (data) => {
        // data = { socketId, msg: {body, name, isAdmin} }
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        sk.disconnect();
      };
    }
  }, [userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim() || !socket || !selectedUser) return;

    const msgData = {
      body: messageBody,
      name: 'Admin Support',
      isAdmin: true,
    };

    // Optimistically update admin UI
    setMessages([...messages, { socketId: selectedUser.socketId, msg: msgData }]);
    
    // Emit to server
    socket.emit('admin_message', {
      socketId: selectedUser.socketId,
      msg: msgData,
    });

    setMessageBody('');
  };

  // Filter messages for the currently selected user
  const currentMessages = messages.filter(m => m.socketId === selectedUser?.socketId).map(m => m.msg);

  return (
    <div className="max-w-7xl mx-auto h-[70vh] flex gap-6 mt-8">
      {/* Sidebar: Active Users */}
      <div className="w-1/3 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            Active Chats
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {activeUsers.length === 0 ? (
            <div className="text-slate-500 dark:text-slate-400 text-center mt-10">No active users</div>
          ) : (
            activeUsers.map((user) => (
              <button
                key={user.socketId}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  selectedUser?.socketId === user.socketId
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="font-bold">{user.name}</div>
                <div className="text-xs opacity-70 truncate mt-1">ID: {user._id}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Chatting with {selectedUser.name}
              </h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/20">
              {currentMessages.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">No messages yet.</div>
              ) : (
                currentMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">{msg.name}</span>
                    <div className={`px-4 py-3 rounded-2xl max-w-[70%] ${
                      msg.isAdmin 
                        ? 'bg-primary text-white rounded-tr-sm' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-tl-sm'
                    }`}>
                      {msg.body}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={submitHandler} className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-4">
              <input 
                type="text" 
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder={`Reply to ${selectedUser.name}...`}
                className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none text-lg"
              />
              <button type="submit" disabled={!messageBody.trim()} className="bg-primary text-white px-8 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <svg className="w-24 h-24 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <p className="text-xl font-medium">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatScreen;
