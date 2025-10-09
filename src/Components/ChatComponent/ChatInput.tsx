import React, { useState } from 'react';
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

  return (
    <div
      className={`flex items-center rounded-lg shadow-inner shadow-orange-400 space-x-2 p-1 bg-black transition-all duration-500 ease-in-out ${
        isExpanded 
          ? 'w-full rounded-t-none rounded-b-lg border-t border-orange-400/20' 
          : 'w-full rounded-lg'
      }`}
    >
      <div
        className="relative"
        onMouseEnter={() => !isExpanded && onShowSuggestions(true)}
        onMouseLeave={() => !isExpanded && onShowSuggestions(false)}
      >
        <button
          className="p-2 text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
          aria-label="AI features"
          onFocus={() => !isExpanded && onShowSuggestions(true)}
          onBlur={() => !isExpanded && onShowSuggestions(false)}
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