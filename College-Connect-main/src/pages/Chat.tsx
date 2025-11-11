import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  lastMessage?: {
    _id: string;
    content: string;
    sender: {
      name: string;
    };
    createdAt: string;
  };
  lastMessageAt: string;
}

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (socket) {
      socket.on('message:received', () => {
        fetchConversations(); // Refresh conversation list
      });
    }

    return () => {
      if (socket) {
        socket.off('message:received');
      }
    };
  }, [socket]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations);
    } catch (error) {
      console.error('Fetch conversations error:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p._id !== currentUser?._id);
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-14">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="divide-y">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Conversations Yet
              </h3>
              <p className="text-gray-600">
                Start chatting from Team Builder by clicking the Message button!
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const other = getOtherParticipant(conversation);
              if (!other) return null;

              return (
                <div
                  key={conversation._id}
                  onClick={() => navigate(`/chat/${conversation._id}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={
                          other.avatar ||
                          `https://ui-avatars.com/api/?name=${other.name}`
                        }
                        alt={other.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {isUserOnline(other._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {other.name}
                        </h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.sender.name === currentUser?.name
                            ? 'You: '
                            : ''}
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;