import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Image } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ModelSelector from '../components/ModelSelector';

export default function ChatPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-border p-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark">VisioNiX Chatbot</h1>
              <p className="text-sm text-gray-500">Vision Analysis Platform</p>
            </div>
            <button
              onClick={() => navigate('/extractions')}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors font-semibold"
            >
              <Image size={20} />
              View Extractions
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatWindow />
          </div>

          {/* Right Sidebar - Model Selector */}
          <div className="w-80 p-6 overflow-y-auto bg-light border-l border-border">
            <ModelSelector />
            
            {/* Info Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">About Models</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Choose different AI models to analyze images with varying capabilities:
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4">
                <li>• <strong>Normal</strong>: Standard image analysis</li>
                <li>• <strong>YOLO</strong>: Fast object detection</li>
                <li>• <strong>CLIP</strong>: Advanced vision-language tasks</li>
                <li>• <strong>Custom</strong>: Specialized models</li>
              </ul>
            </div>

            {/* Features Section */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Features</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>✓ Image Analysis</li>
                <li>✓ Object Detection</li>
                <li>✓ Text Recognition (OCR)</li>
                <li>✓ Scene Understanding</li>
                <li>✓ Color & Texture Analysis</li>
                <li>✓ CLIP Embeddings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
