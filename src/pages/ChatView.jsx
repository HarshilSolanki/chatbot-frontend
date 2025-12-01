import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import { useAuthStore } from '../store/authStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

function ChatView() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    const initializeSocket = () => {
      const newSocket = io(WS_URL, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        // Admin joins admin-room, not the user's session room
        // This prevents receiving their own messages via socket
        newSocket.emit('user:join', { sessionId, meta: { isAdmin: true } });
      });

      newSocket.on('server:message', (data) => {
        if (data.sessionId === sessionId) {
          setMessages((prev) => {
            // Check if message already exists (prevent duplicates)
            const messageExists = prev.some((msg) => msg.id === data.id);
            if (messageExists) {
              return prev;
            }
            // Don't add admin's own messages from socket (they're already added from API response)
            // Only add messages from users or AI
            if (data.sender === 'admin') {
              return prev;
            }
            return [
              ...prev,
              {
                id: data.id || `msg_${Date.now()}_${Math.random()}`,
                sender: data.sender,
                content: data.content,
                createdAt: data.timestamp,
              },
            ];
          });
        }
      });

      newSocket.on('server:typing', (data) => {
        if (data.sessionId === sessionId && data.sender === 'user') {
          setTyping(true);
          setTimeout(() => setTyping(false), 3000);
        }
      });

      setSocket(newSocket);
    };

    initializeSocket();
    loadMessages();
    markAsRead();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const loadMessages = async () => {
    try {
      const response = await api.get(`/session/${sessionId}/messages`);
      // Format messages consistently
      const formattedMessages = response.data.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        createdAt: msg.createdAt,
        timestamp: msg.createdAt,
      }));
      setMessages(formattedMessages);
      
      // Get AI status
      const sessionsResponse = await api.get('/session');
      const session = sessionsResponse.data.find((s) => s.sessionId === sessionId);
      if (session) {
        setAiEnabled(session.aiEnabled);
      }
    } catch (error) {
      console.error('Failed to load messages', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await api.patch(`/session/${sessionId}/read`);
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const messageContent = input.trim();
    setInput(''); // Clear input immediately to prevent double submission

    try {
      const response = await api.post(`/session/${sessionId}/message`, { 
        content: messageContent 
      });
      
      // Add the message to state immediately from API response
      // This prevents duplicates when socket also emits it
      const newMessage = {
        id: response.data.id,
        sender: response.data.sender,
        content: response.data.content,
        createdAt: response.data.createdAt,
        timestamp: response.data.createdAt,
      };
      
      setMessages((prev) => {
        // Check if already added (prevent duplicates)
        const exists = prev.some((msg) => msg.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    } catch (error) {
      console.error('Failed to send message', error);
      // Restore input on error
      setInput(messageContent);
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('admin:typing', { sessionId });
    }
  };

  const toggleAI = async () => {
    try {
      const response = await api.patch(`/session/${sessionId}/ai`, {
        aiEnabled: !aiEnabled,
      });
      setAiEnabled(response.data.aiEnabled);
    } catch (error) {
      console.error('Failed to toggle AI', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Chat: {sessionId.slice(0, 20)}...
              </h1>
              <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
            </div>
          </div>
          <button
            onClick={toggleAI}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              aiEnabled
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {aiEnabled ? 'AI Enabled' : 'Enable AI'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {typing && <TypingIndicator user="user" />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (e.target.value.trim()) {
                  handleTyping();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatView;

