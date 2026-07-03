import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from './ui/Button';

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
        <div className="glass-card w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              <h3 className="font-bold tracking-tight">Live Support</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80 rounded-full h-8 w-8 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-background/50 space-y-4 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm mt-10 p-6">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                Welcome! How can we help you today?
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}>
                  <span className="text-[10px] text-muted-foreground mb-1 px-1">{msg.name}</span>
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                    msg.isAdmin 
                      ? 'bg-secondary text-foreground rounded-tl-sm' 
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
          <form onSubmit={submitHandler} className="p-3 bg-card border-t border-border/50 flex gap-2">
            <input 
              type="text" 
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-secondary border-none rounded-xl px-4 py-2 text-foreground focus:ring-2 focus:ring-primary/30 outline-none text-sm"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!messageBody.trim()}
              className="rounded-xl h-9 w-9 bg-primary"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </form>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 bg-primary hover:bg-primary/95 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatBox;
