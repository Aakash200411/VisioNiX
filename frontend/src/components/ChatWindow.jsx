import { useEffect, useRef, useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import Message from './Message';

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { getCurrentChat, addMessage, currentChatId, selectedModel, updateChatTitle } = useChat();

  const currentChat = getCurrentChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentChat) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    addMessage(currentChatId, userMessage);
    setInput('');
    setLoading(true);

    // Update chat title if it's the first message
    if (currentChat.messages.length === 0) {
      const title = input.substring(0, 30) + (input.length > 30 ? '...' : '');
      updateChatTitle(currentChatId, title);
    }

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a response using the ${selectedModel} model. In a real implementation, this would connect to the backend API for actual image analysis.`
      };
      addMessage(currentChatId, assistantMessage);
      setLoading(false);
    }, 1000);
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-light">
        <p className="text-gray-500">No chat selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-light">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentChat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-dark mb-2">Start a new conversation</h2>
              <p className="text-gray-500 mb-4">Analyze images using AI models and extract visual data</p>
            </div>
          </div>
        ) : (
          <>
            {currentChat.messages.map(message => (
              <Message key={message.id} message={message} />
            ))}
            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                  <Loader size={18} className="animate-spin" />
                </div>
                <div className="bg-light border border-border rounded-lg px-4 py-2 rounded-bl-none">
                  <p className="text-sm text-gray-500">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Upload an image or describe what you want to analyze..."
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}
