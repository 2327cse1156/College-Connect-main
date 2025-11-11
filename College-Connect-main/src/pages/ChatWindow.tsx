import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    avatar?: string;
  }>;
}

const ChatWindow = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { socket, onlineUsers } = useSocket();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
      fetchMessages();
      
      // Join conversation room
      if (socket) {
        socket.emit('join:conversation', conversationId);
      }

      // Mark messages as read
      markAsRead();
    }

    return () => {
      if (socket && conversationId) {
        socket.emit('typing:stop', {
          conversationId,
          userId: currentUser?._id,
        });
      }
    };
  }, [conversationId]);

  // Listen for new messages
  useEffect(() => {
    if (socket) {
      socket.on('message:received', (message: Message) => {
        setMessages((prev)=>{
            const exists = prev.some(m=>m._id === message._id);
            if(exists) return prev;

            return [...prev, message];
        });
        scrollToBottom();
        
        // Mark as read if window is active
        if (document.hasFocus() && conversationId) {
          markAsRead();
        }
      });

      socket.on('typing:user', ({ userName }: { userName: string }) => {
        setIsTyping(true);
        setTypingUser(userName);
      });

      socket.on('typing:stop', () => {
        setIsTyping(false);
        setTypingUser('');
      });
    }

    return () => {
      if (socket) {
        socket.off('message:received');
        socket.off('typing:user');
        socket.off('typing:stop');
      }
    };
  }, [socket, conversationId]);

  const fetchConversation = async () => {
    try {
      const res = await api.get(`/chat/conversations`);
      const conv = res.data.conversations.find(
        (c: Conversation) => c._id === conversationId
      );
      setConversation(conv);
    } catch (error) {
      console.error('Fetch conversation error:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(res.data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Fetch messages error:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await api.put(`/chat/conversations/${conversationId}/read`);
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTyping = () => {
    if (socket && conversationId && currentUser) {
      socket.emit('typing:start', {
        conversationId,
        userId: currentUser._id,
        userName: currentUser.name,
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing:stop', {
          conversationId,
          userId: currentUser._id,
        });
      }, 2000);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const response = await api.post(`/chat/conversations/${conversationId}/messages`, {
        content: messageContent,
      });

      const sentMessage = response.data.message;
      setMessages((prev)=> [...prev,sentMessage]);
      scrollToBottom();

      // Stop typing indicator
      if (socket && conversationId && currentUser) {
        socket.emit('typing:stop', {
          conversationId,
          userId: currentUser._id,
        });
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = () => {
    return conversation?.participants.find((p) => p._id !== currentUser?._id);
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  const formatMessageTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const otherUser = getOtherParticipant();

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col bg-white rounded-lg shadow-md border border-gray-200 mt-16">
      {/* Header */}
      <div className="p-3 sm:p-4 bg-gray-50 border-b flex items-center gap-3">
        <button
          title="Back to chat"
          onClick={() => navigate('/chat')}
          className="p-2 hover:bg-gray-200 rounded-full transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        
        {otherUser && (
          <>
            <div className="relative">
              <img
                src={
                  otherUser.avatar ||
                  `https://ui-avatars.com/api/?name=${otherUser.name}`
                }
                alt={otherUser.name}
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              {isUserOnline(otherUser._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 leading-none">{otherUser.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isUserOnline(otherUser._id) ? 'Online' : 'Offline'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((message) => {
          const isOwnMessage = message.sender._id === currentUser?._id;
          
          return (
            <div
              key={message._id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm lg:max-w-md ${
                  isOwnMessage
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 border rounded-bl-none'
                } rounded-lg px-4 py-2`}
              >
                <p className="break-words text-sm sm:text-base">{message.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 animate-pulse">
              <p className="text-sm text-gray-600">{typingUser} is typing...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={sending}
          />
          <button
            type="submit"
            title="Send message"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;