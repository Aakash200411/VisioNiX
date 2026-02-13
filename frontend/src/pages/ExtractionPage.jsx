import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useExtraction } from '../hooks/useExtraction';
import { ArrowLeft } from 'lucide-react';
import ExtractionCard from '../components/ExtractionCard';
import ExtractionDetails from '../components/ExtractionDetails';

export default function ExtractionPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { extractions, selectedExtraction, getCurrentExtraction, deleteExtraction, setSelectedExtraction } = useExtraction();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const currentExtraction = getCurrentExtraction();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Chat
          </button>
          <h1 className="text-2xl font-bold text-black">Extraction Results</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {extractions.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
            <h2 className="text-xl font-semibold text-black mb-2">No Extractions Yet</h2>
            <p className="text-gray-600 mb-4">
              Upload images in the chat to see extraction results here.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Go to Chat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Extractions List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
                <h2 className="font-semibold text-black mb-4">Analyzed Images</h2>
                <p className="text-xs text-gray-600 mb-4">{extractions.length} extraction(s)</p>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {extractions.map(extraction => (
                    <ExtractionCard
                      key={extraction.id}
                      extraction={extraction}
                      isSelected={selectedExtraction === extraction.id}
                      onSelect={() => setSelectedExtraction(extraction.id)}
                      onDelete={deleteExtraction}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Details View */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ExtractionDetails extraction={currentExtraction} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
