# Chatbot Frontend

A modern React application for a real-time AI-powered chatbot system with a customer chat widget and admin dashboard.

## 🚀 Features

- **Customer Chat Widget**: Floating chat button with modern UI
- **Admin Dashboard**: View and manage all chat sessions
- **Real-time Messaging**: Socket.IO for instant message delivery
- **Typing Indicators**: Real-time typing status
- **Unread Message Counts**: Track unread messages per session
- **Responsive Design**: TailwindCSS for beautiful, responsive UI
- **State Management**: Zustand for efficient state management
- **Session Persistence**: Messages persist across page reloads

## 📋 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Code Quality**: ESLint, Prettier

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [backend README](../backend/README.md))

### Setup

1. **Clone the repository** (or navigate to frontend directory)

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000
```

4. **Start development server**

```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── ChatButton.jsx       # Floating chat button
│   │   ├── ChatWindow.jsx      # Chat window UI
│   │   ├── CustomerChat.jsx     # Customer chat widget
│   │   ├── MessageBubble.jsx    # Message component
│   │   └── TypingIndicator.jsx  # Typing animation
│   ├── pages/
│   │   ├── Login.jsx            # Admin login page
│   │   ├── ChatList.jsx         # Admin dashboard
│   │   └── ChatView.jsx         # Admin chat view
│   ├── services/
│   │   └── api.js               # Axios API client
│   ├── store/
│   │   ├── authStore.js         # Auth state (Zustand)
│   │   └── chatStore.js         # Chat state (Zustand)
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # TailwindCSS configuration
└── postcss.config.js           # PostCSS configuration
```

## 🎯 Usage

### Customer Chat Widget

1. Navigate to the root URL (`http://localhost:5173`)
2. Click the floating chat button in the bottom-right corner
3. Start typing and sending messages
4. Messages are automatically saved and persist across page refreshes

**Features:**
- Persistent session ID in localStorage
- Real-time message delivery
- Typing indicators
- Message timestamps
- Auto-scroll to latest message

### Admin Dashboard

1. Navigate to `/login`
2. Login with admin credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. View all chat sessions in the dashboard
4. Click on any session to open the chat view
5. Reply to customer messages
6. Toggle AI responses for any session

**Features:**
- View all chat sessions
- Unread message counts
- Last message preview
- AI toggle per session
- Real-time message updates
- Mark messages as read

## 🔌 API Integration

### API Client

The frontend uses Axios for API calls, configured in `src/services/api.js`:

```javascript
import api from './services/api';

// Create session
const response = await api.post('/session', { sessionId, deviceInfo });

// Get messages
const messages = await api.get(`/session/${sessionId}/messages`);

// Admin login
const { token, user } = await api.post('/admin/login', { username, password });
```

### Socket.IO Integration

Socket.IO client is used for real-time messaging:

```javascript
import { io } from 'socket.io-client';

const socket = io(WS_URL, {
  transports: ['websocket'],
});

// Join session
socket.emit('user:join', { sessionId, meta });

// Send message
socket.emit('user:message', { sessionId, content });

// Listen for messages
socket.on('server:message', (data) => {
  // Handle new message
});
```

## 🎨 Styling

The project uses TailwindCSS for styling. Configuration is in `tailwind.config.js`.

### Customization

To customize colors, spacing, or other design tokens, edit `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563eb',
      },
    },
  },
}
```

## 📝 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 🏗️ Building for Production

1. **Build the application**

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

2. **Preview the build**

```bash
npm run preview
```

3. **Deploy**

Deploy the `dist/` directory to your hosting provider (Vercel, Netlify, AWS S3, etc.).

### Environment Variables for Production

Update your `.env` file with production URLs:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=https://api.yourdomain.com
```

## 🔐 Authentication

Admin authentication uses JWT tokens stored in localStorage:

- Token is stored in `localStorage.getItem('authToken')`
- Token is automatically added to API requests via Axios interceptors
- Protected routes redirect to `/login` if not authenticated

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

The chat widget adapts to screen size and maintains usability on all devices.

## 🐛 Troubleshooting

### API Connection Issues

- Verify `VITE_API_URL` matches your backend URL
- Check CORS settings on backend
- Ensure backend is running

### Socket.IO Connection Issues

- Verify `VITE_WS_URL` matches your backend WebSocket URL
- Check browser console for WebSocket errors
- Ensure backend Socket.IO server is running

### Messages Not Loading

- Check browser console for errors
- Verify sessionId is stored in localStorage
- Check network tab for API request failures

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## 🧪 Development

### Adding New Components

1. Create component in `src/components/`
2. Import and use in pages or other components
3. Style with TailwindCSS classes

### Adding New Pages

1. Create page in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation if needed

### State Management

Use Zustand stores for global state:

```javascript
import { useChatStore } from '../store/chatStore';

const { messages, addMessage } = useChatStore();
```

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React, Vite, and TailwindCSS**

