import { Copy, Download } from 'lucide-react';
import { useState } from 'react';

export default function ExtractionDetails({ extraction }) {
  const [copied, setCopied] = useState(false);

  if (!extraction) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Select an extraction to view details</p>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(extraction, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extraction_${extraction.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-dark mb-2">{extraction.image_name}</h2>
        <p className="text-gray-500 text-sm">
          {new Date(extraction.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => copyToClipboard(JSON.stringify(extraction, null, 2))}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          <Copy size={18} />
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
        <button
          onClick={downloadJSON}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors"
        >
          <Download size={18} />
          Download JSON
        </button>
      </div>

      {/* Caption */}
      <div className="bg-white p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-dark mb-2">Image Caption</h3>
        <p className="text-gray-700 leading-relaxed">{extraction.caption}</p>
      </div>

      {/* Objects */}
      <div className="bg-white p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-dark mb-3">Detected Objects</h3>
        {extraction.objects && extraction.objects.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {extraction.objects.map((obj, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium"
              >
                {obj}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No objects detected</p>
        )}
      </div>

      {/* Scene Labels */}
      <div className="bg-white p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-dark mb-3">Scene Labels</h3>
        {extraction.scene_labels && extraction.scene_labels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {extraction.scene_labels.map((label, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-secondary bg-opacity-10 text-secondary rounded-full text-sm font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No scene labels</p>
        )}
      </div>

      {/* OCR Text */}
      <div className="bg-white p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-dark mb-2">OCR Text</h3>
        {extraction.ocr_text ? (
          <p className="text-gray-700 text-sm leading-relaxed bg-light p-3 rounded border border-border overflow-x-auto max-h-32">
            {extraction.ocr_text}
          </p>
        ) : (
          <p className="text-gray-500 text-sm">No text detected in image</p>
        )}
      </div>

      {/* Color Features */}
      <div className="bg-white p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-dark mb-3">Color Features (RGB Mean)</h3>
        {extraction.color_features ? (
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">R</span>
                <span className="font-semibold text-dark">{extraction.color_features[0]?.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">G</span>
                <span className="font-semibold text-dark">{extraction.color_features[1]?.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">B</span>
                <span className="font-semibold text-dark">{extraction.color_features[2]?.toFixed(1)}</span>
              </div>
            </div>
            <div
              className="w-20 h-20 rounded-lg border-2 border-gray-300 shadow"
              style={{
                backgroundColor: `rgb(${extraction.color_features[0]}, ${extraction.color_features[1]}, ${extraction.color_features[2]})`
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No color data</p>
        )}
      </div>

      {/* Texture Features */}
      <div className="bg-white p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-dark mb-3">Texture Features</h3>
        {extraction.texture_features && extraction.texture_features.length > 0 ? (
          <div className="space-y-2">
            {extraction.texture_features.map((feature, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Feature {idx + 1}</span>
                  <span className="font-semibold text-dark">{feature.toFixed(4)}</span>
                </div>
                <div className="w-full bg-light rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${feature * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No texture data</p>
        )}
      </div>

      {/* CLIP Embedding */}
      <div className="bg-white p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-dark mb-2">CLIP Embedding</h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">File:</span> {extraction.clip_embedding_file}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Path:</span>{' '}
            <code className="bg-light px-2 py-1 rounded text-xs break-all">{extraction.clip_embedding_path}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
