function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const timestamp = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : isAI
            ? 'bg-purple-100 text-purple-900'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        {!isUser && (
          <div className="text-xs font-semibold mb-1 opacity-75">
            {isAI ? 'AI Assistant' : 'Admin'}
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;

