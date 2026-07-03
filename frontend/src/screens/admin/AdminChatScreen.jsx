import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { MessageSquare, Send, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
    <div className="max-w-7xl mx-auto h-[75vh] flex gap-6 mt-8">
      {/* Sidebar: Active Users */}
      <div className="w-1/3 bg-card border border-border/50 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <div className="p-6 border-b border-border/50 bg-secondary/30">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            Active Chats
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {activeUsers.length === 0 ? (
            <div className="text-muted-foreground text-center mt-10 text-sm">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
              No active customer chats
            </div>
          ) : (
            activeUsers.map((user) => (
              <button
                key={user.socketId}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  selectedUser?.socketId === user.socketId
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card border-border/40 hover:bg-secondary/50 text-foreground'
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {user.name}
                </div>
                <div className="text-[10px] text-muted-foreground truncate mt-1">ID: {user._id}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 bg-card border border-border/50 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        {selectedUser ? (
          <>
            <div className="p-6 border-b border-border/50 bg-secondary/30">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Chatting with <span className="text-primary">{selectedUser.name}</span>
              </h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide bg-secondary/10">
              {currentMessages.length === 0 ? (
                <div className="text-center text-muted-foreground mt-10 text-sm">No messages yet. Start chatting below!</div>
              ) : (
                currentMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-muted-foreground mb-1 px-1">{msg.name}</span>
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[70%] text-sm shadow-sm ${
                      msg.isAdmin 
                        ? 'bg-primary text-white rounded-tr-sm' 
                        : 'bg-secondary text-foreground rounded-tl-sm'
                    }`}>
                      {msg.body}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={submitHandler} className="p-4 border-t border-border/50 flex gap-3 bg-card">
              <input 
                type="text" 
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder={`Reply to ${selectedUser.name}...`}
                className="flex-1 bg-secondary border-none rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/30 outline-none text-sm"
              />
              <Button 
                type="submit" 
                disabled={!messageBody.trim()} 
                className="px-6 rounded-xl font-semibold shadow-sm h-11"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/60 p-12">
            <MessageSquare className="w-16 h-16 mb-4 text-muted-foreground/20" />
            <p className="text-lg font-medium">Select an active chat room to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatScreen;
