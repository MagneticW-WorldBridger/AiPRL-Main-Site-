import React, { useState, useRef, useEffect } from 'react';
import {
  IoSend, IoSparklesOutline,
  IoClose
} from 'react-icons/io5';
import useAutoTyping from '../../hooks/useAutoTyping';

interface ChatInputProps {
  messages: string[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
  isExpanded: boolean;
  showSuggestions: boolean;
  onShowSuggestions: (show: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  messages, 
  onClose, 
  onSendMessage, 
  isExpanded,
  showSuggestions: _showSuggestions,
  onShowSuggestions
}) => {
  const autoTypeText = useAutoTyping({ messages, loop: true });
  const [inputValue, setInputValue] = useState('');
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle showing suggestions
  const showSuggestions = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSuggestionsVisible(true);
    onShowSuggestions(true);
  };

  // Handle hiding suggestions with delay
  const hideSuggestions = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      // Only hide if we're not currently showing suggestions due to click
      if (isSuggestionsVisible) {
        setIsSuggestionsVisible(false);
        onShowSuggestions(false);
      }
    }, 1000); // 1000ms delay before hiding
  };

  // Sync local state with parent state
  useEffect(() => {
    if (!_showSuggestions) {
      setIsSuggestionsVisible(false);
    }
  }, [_showSuggestions]);

  // Handle click on suggestions button
  const handleSuggestionsClick = () => {
    if (isSuggestionsVisible) {
      hideSuggestions();
    } else {
      showSuggestions();
    }
  };

  // Handle click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
        onShowSuggestions(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    if (isSuggestionsVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSuggestionsVisible, onShowSuggestions]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex items-center rounded-lg shadow-inner shadow-orange-400 space-x-2 p-1 bg-black transition-all duration-500 ease-in-out ${
        isExpanded 
          ? 'w-full rounded-t-none rounded-b-lg border-t border-orange-400/20' 
          : 'w-full rounded-lg'
      }`}
    >
      <div
        className="relative"
        onMouseEnter={() => !isExpanded && showSuggestions()}
        onMouseLeave={() => !isExpanded && hideSuggestions()}
      >
        <button
          className="p-2 text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
          aria-label="AI features"
          onClick={handleSuggestionsClick}
          onFocus={() => !isExpanded && showSuggestions()}
          onBlur={() => !isExpanded && hideSuggestions()}
        >
          <IoSparklesOutline className="w-5 h-5" />
        </button>
      </div>

      <input
        type="text"
        className="flex-grow p-3 w-full text-white placeholder-gray-400 outline-none bg-transparent transition-all duration-300 ease-in-out"
        placeholder={inputValue ? '' : autoTypeText}
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        aria-label="Chat input"
      />

      {/* <button
        className="p-2 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
        aria-label="Record voice message"
      >
        <IoMic className="w-5 h-5" />
      </button> */}

      <button
        onClick={handleSendMessage}
        disabled={!inputValue.trim()}
        className={`p-2 rounded-full outline-none transition-all duration-300 ${
          inputValue.trim()
            ? 'text-orange-400 cursor-pointer hover:text-orange-300 hover:bg-orange-400/10'
            : 'text-white/50 cursor-not-allowed'
        }`}
        aria-label="Send message"
      >
        <IoSend className="w-5 h-5" />
      </button>

      <button
        onClick={onClose}
        className="p-2 rounded-full cursor-pointer text-white/50 hover:text-white hover:bg-white/10 outline-none transition-all duration-300"
        aria-label="Close chat"
      >
        <IoClose className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatInput;