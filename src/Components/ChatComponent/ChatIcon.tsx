import React from 'react';
import { IoChatbubbleEllipsesSharp, IoClose } from 'react-icons/io5'; // Using react-icons for a clean look

interface ChatIconProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatIcon: React.FC<ChatIconProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-40 z-50 p-3 bg-orange-400 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-colors duration-300 ease-in-out"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <IoClose className="w-6 h-6 text-white" />
      ) : (
        <IoChatbubbleEllipsesSharp className="w-6 h-6 text-white" />
      )}
    </button>
  );
};

export default ChatIcon;
