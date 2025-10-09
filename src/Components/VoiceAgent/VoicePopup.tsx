import { useRef } from 'react';
import { X } from 'lucide-react';

interface VoicePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoicePopup({ isOpen, onClose }: VoicePopupProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-connect is handled via embed mode parameter in the iframe URL
  // No need for message passing to prevent duplicate connections

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-[60%] h-[80%] max-w-6xl max-h-[95vh] bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="absolute  top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Voice Agent Iframe */}
        <iframe
          ref={iframeRef}
          src="http://localhost:3000/voice-test-rings.html?embed=1&theme=dark"
          className="w-full h-full border-0"
          allow="microphone; autoplay; screen-wake-lock; camera"
          title="AiPRL Voice Assistant"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
        />
      </div>
    </div>
  );
}
