import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import { useChatStore } from '../store/chatStore';
import api from '../services/api';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

function CustomerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { socket, setSocket, addMessage, setMessages, setTyping } = useChatStore();

  useEffect(() => {
    // Get or create session
    const initializeSession = async () => {
      try {
        let storedSessionId = localStorage.getItem('chatSessionId');
        
        const response = await api.post('/session', {
          sessionId: storedSessionId,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
          },
        });

        const newSessionId = response.data.sessionId;
        setSessionId(newSessionId);
        localStorage.setItem('chatSessionId', newSessionId);

        // Load existing messages FIRST before setting up socket
        await loadMessages(newSessionId);

        // Connect socket
        const newSocket = io(WS_URL, {
          transports: ['websocket'],
        });

        newSocket.on('connect', () => {
          newSocket.emit('user:join', {
            sessionId: newSessionId,
            meta: { userAgent: navigator.userAgent },
          });
        });

        newSocket.on('server:message', (data) => {
          // Only add message if it's not already in the store (prevent duplicates)
          addMessage({
            id: data.id || `msg_${Date.now()}_${Math.random()}`,
            sender: data.sender,
            content: data.content,
            timestamp: data.timestamp || new Date().toISOString(),
            createdAt: data.timestamp || new Date().toISOString(),
          });
        });

        newSocket.on('server:typing', (data) => {
          if (data.sender === 'admin') {
            setTyping(true, 'admin');
            setTimeout(() => setTyping(false), 3000);
          }
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error('Failed to initialize session', error);
      }
    };

    initializeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async (sid) => {
    try {
      const response = await api.get(`/session/${sid}/messages`);
      // Transform messages to match the expected format
      const formattedMessages = response.data.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.createdAt,
        createdAt: msg.createdAt,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages', error);
      // If it's a 404, the session might not exist yet, that's okay
      if (error.response?.status !== 404) {
        console.error('Error details:', error.response?.data || error.message);
      }
    }
  };

  const handleSendMessage = (content) => {
    if (socket && sessionId && content.trim()) {
      socket.emit('user:message', {
        sessionId,
        content: content.trim(),
      });
    }
  };

  const handleTyping = () => {
    if (socket && sessionId) {
      socket.emit('user:typing', { sessionId });
    }
  };

  // Reload messages when chat window opens
  useEffect(() => {
    if (isOpen && sessionId) {
      loadMessages(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sessionId]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <ChatWindow
          onClose={() => setIsOpen(false)}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
        />
      ) : (
        <ChatButton onClick={() => setIsOpen(true)} />
      )}
    </div>
  );
}

export default CustomerChat;

