import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

function ChatList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.get('/session');
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to load sessions', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Chat Sessions</h1>
          <button
            onClick={() => {
              logout();
              localStorage.removeItem('authToken');
              navigate('/login');
            }}
            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No chat sessions yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => navigate(`/admin/chat/${session.sessionId}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        Session: {session.sessionId.slice(0, 20)}...
                      </h3>
                      {session.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {session.unreadCount}
                        </span>
                      )}
                      {session.aiEnabled && (
                        <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          AI
                        </span>
                      )}
                    </div>
                    {session.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium">
                          {session.lastMessage.sender === 'user'
                            ? 'User'
                            : session.lastMessage.sender === 'ai'
                            ? 'AI'
                            : 'You'}
                          :
                        </span>{' '}
                        {session.lastMessage.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {formatTime(session.lastMessage?.createdAt || session.updatedAt)}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;

