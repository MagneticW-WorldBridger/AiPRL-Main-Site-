import { useRef, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { getUserId } from '../../utils/userIdentity';

interface VoicePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoicePopup({ isOpen, onClose }: VoicePopupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const userId = useMemo(() => getUserId(), []);

  // Load the standalone voice agent directly into the modal
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Create iframe that loads the standalone page
    const iframe = document.createElement('iframe');
    const voiceServiceUrl = import.meta.env.VITE_VOICE_SERVICE_URL || 'http://localhost:3000';
    iframe.src = `${voiceServiceUrl}/voice-test-rings.html?embed=1&theme=dark&userId=${userId}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allow = 'microphone; autoplay; screen-wake-lock; camera';
    iframe.title = 'AiPRL Voice Assistant';
    
    // Remove sandbox to allow microphone access
    // iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups';
    
    containerRef.current.appendChild(iframe);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-[95%] h-[95%] max-w-none max-h-none bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-500/50">
        {/* Header */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Voice Agent Container */}
        <div 
          ref={containerRef}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
