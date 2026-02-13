import { Plus, Trash2, History, LogOut } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { chats, currentChatId, createNewChat, setCurrentChatId, deleteChat } = useChat();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-dark text-white h-screen flex flex-col border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-3">
          <History size={16} />
          Chat History
        </div>
        
        {chats.length === 0 ? (
          <p className="text-gray-500 text-sm">No chats yet</p>
        ) : (
          <div className="space-y-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 group ${
                  currentChatId === chat.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentChatId(chat.id)}
                    className="flex-1 text-left truncate text-sm font-medium"
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={() => deleteChat(chat.id)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 ${
                      currentChatId === chat.id ? 'text-white' : 'text-gray-400 hover:text-error'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(chat.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <div className="bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{user?.email || 'User'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-error hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
