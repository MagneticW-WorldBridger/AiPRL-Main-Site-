import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoSend, IoSparklesOutline, IoClose } from 'react-icons/io5';
import useAutoTyping from '../../hooks/useAutoTyping';

interface ChatInputProps {
  messages: string[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
  isExpanded: boolean;
  showSuggestions: boolean; // This prop is the single source of truth
  onShowSuggestions: (show: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  messages,
  onClose,
  onSendMessage,
  isExpanded,
  showSuggestions,
  onShowSuggestions
}) => {
  const autoTypeText = useAutoTyping({ messages, loop: true });
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Handlers for Input and Sending Messages ---

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

  // --- Logic for Showing/Hiding Suggestions ---

  // useCallback ensures these functions aren't recreated on every render
  const hideSuggestionsWithDelay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a timeout to hide suggestions
    timeoutRef.current = setTimeout(() => {
      onShowSuggestions(false);
    }, 6000); // 6000ms delay
  }, [onShowSuggestions]);

  const showSuggestionsAndClearTimeout = useCallback(() => {
    // If a hide timeout is pending, clear it
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Immediately show suggestions
    onShowSuggestions(true);
  }, [onShowSuggestions]);

  // Handle click on the suggestions button (sparkles icon)
  const handleSuggestionsClick = () => {
    // Simply toggle the current state
    if (showSuggestions) {
      onShowSuggestions(false);
    } else {
      showSuggestionsAndClearTimeout();
    }
  };

  // --- Effects for Cleanup and External Clicks ---

  // Handle click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onShowSuggestions(false); // Hide immediately on outside click
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions, onShowSuggestions]);

  // General cleanup for the timeout on unmount
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
      className={`flex items-center rounded-lg shadow-inner shadow-orange-400 space-x-2 lg:p-1 bg-black transition-all duration-500 ease-in-out ${
        isExpanded 
          ? 'w-full rounded-t-none rounded-b-lg border-t border-orange-400/20' 
          : 'w-full rounded-lg'
      }`}
    >
      <div
        className="relative"
        // Don't show suggestions on hover if the chat is expanded
        onMouseEnter={() => !isExpanded && showSuggestionsAndClearTimeout()}
        onMouseLeave={() => !isExpanded && hideSuggestionsWithDelay()}
      >
        <button
          className="p-2 text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
          aria-label="AI features"
          onClick={handleSuggestionsClick}
          onFocus={() => !isExpanded && showSuggestionsAndClearTimeout()}
          onBlur={() => !isExpanded && hideSuggestionsWithDelay()}
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

      {/* Close button - Only show when chat is NOT expanded */}
      {!isExpanded && (
        <button
          onClick={onClose}
          className="p-2 rounded-full cursor-pointer text-white/50 hover:text-white hover:bg-white/10 outline-none transition-all duration-300"
          aria-label="Close chat"
        >
          <IoClose className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ChatInput;