import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import ChatInput from "./ChatInput";
import SuggestedResponses from "./SuggestedResponses";
import ChatMessages from "./ChatMessages";

const chatPlaceholderMessages = [
  "What can I help you with?",
  "How can AiprlAssist improve my inbound conversion rates?",
  "How easy is it to test AiprlAssist?",
  "Can I see AiprlAssist trained on my website?",
  "How can AiprlAssist ensure data privacy and compliance with GDPR?",
];

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reopenTimerRef = useRef<number | null>(null);

  // Close handler: closes now, auto-reopens in 20s
  const handleClose = () => {
    if (isExpanded) {
      // If expanded, just collapse back to compact mode
      setIsExpanded(false);
      setMessages([]);
    } else {
      // If already compact, close completely and reopen after 20s
      setIsOpen(false);
      setIsExpanded(false);
      setMessages([]);

      // Clear any existing timer
      if (reopenTimerRef.current) {
        window.clearTimeout(reopenTimerRef.current);
        reopenTimerRef.current = null;
      }

      // Re-open after 20 seconds
      reopenTimerRef.current = window.setTimeout(() => {
        setIsOpen(true);
        reopenTimerRef.current = null;
      }, 20000);
    }
  };

  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setShowSuggestions(false);
      setMessages(prev => [...prev, userMessage]);
      setIsExpanded(true);

      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for your message! I'm here to help you with AiprlAssist. How can I assist you further?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    setShowSuggestions(false);
  };

  // Clears timer if component unmounts
  useEffect(() => {
    return () => {
      if (reopenTimerRef.current) {
        window.clearTimeout(reopenTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="chat-topdrop"
        unmountOnExit
        nodeRef={panelRef}
      >
        <div
          ref={panelRef}
          className={`fixed item-center z-50 rounded-lg flex top-4 flex-col items-center justify-center transition-all duration-500 ease-in-out transform origin-top ${isExpanded
              ? 'w-full lg:max-w-5xl h-[90vh] left-1/2 -translate-x-1/2 overflow-visible'
              : 'w-full lg:max-w-5xl lg:mt-3 mt-10 left-1/2 -translate-x-1/2 overflow-visible'
            }`}
        >
          {/* Chat messages - only show when expanded */}
          {isExpanded && (
            <div className="flex-1 w-full bg-black border border-orange-400/20 rounded-t-lg">
              <ChatMessages messages={messages} />
            </div>
          )}

          {/* Input container */}
          <div className="relative w-full" onMouseLeave={() => setShowSuggestions(false)}>
            {/* Suggestions dropdown on Default */}
            {showSuggestions && !isExpanded && (
              <div className="absolute top-full left-0 right-0 mb-2 z-[60]">
                <SuggestedResponses onSuggestionClick={handleSuggestionClick} />
              </div>
            )}

            {/* Input container */}
            <ChatInput
              messages={chatPlaceholderMessages}
              onClose={handleClose}
              onSendMessage={handleSendMessage}
              isExpanded={isExpanded}
              showSuggestions={showSuggestions}
              onShowSuggestions={setShowSuggestions}
            />

            {/* Suggestions dropdown when expanded */}
            {showSuggestions && isExpanded && (
              <div className="absolute bottom-full left-0 right-0 mt-2 z-[60]">
                <SuggestedResponses onSuggestionClick={handleSuggestionClick} />
              </div>
            )}
          </div>
        </div>
      </CSSTransition>

      {/* CSS for animations */}
      {/* <style jsx>{`
        .chat-enter {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        .chat-enter-active {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: opacity 300ms, transform 300ms;
        }
        .chat-exit {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .chat-exit-active {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style> */}
    </>
  );
};

export default ChatContainer;