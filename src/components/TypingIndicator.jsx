function TypingIndicator({ user = 'admin' }) {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 rounded-lg px-4 py-2">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{user === 'admin' ? 'Admin is typing...' : 'Typing...'}</p>
      </div>
    </div>
  );
}

export default TypingIndicator;

