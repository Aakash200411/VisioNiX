import { User, Bot } from 'lucide-react';

export default function Message({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 mb-4 message-animate ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary text-white' : 'bg-secondary text-white'
      }`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-light text-dark border border-border rounded-bl-none'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
