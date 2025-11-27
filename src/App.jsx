import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ChatList from './pages/ChatList';
import ChatView from './pages/ChatView';
import CustomerChat from './components/CustomerChat';
import { useAuthStore } from './store/authStore';

function App() {
  const { token } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={token ? <ChatList /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/chat/:sessionId"
          element={token ? <ChatView /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<CustomerChat />} />
      </Routes>
    </div>
  );
}

export default App;

