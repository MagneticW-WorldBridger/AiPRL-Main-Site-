import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import ChatInput from "./ChatInput";
import SuggestedResponses from "./SuggestedResponses";
import ChatMessages from "./ChatMessages";
import { useChatApi } from "../../hooks/useChatApi";

const chatPlaceholderMessages = [
  "What can I help you with?",
  "How can AiPRL Assist improve my inbound conversion rates?",
  "How easy is it to test AiPRL Assist?",
  "Can I see AiPRL Assist trained on my website?",
  "How can AiPRL Assist ensure data privacy and compliance with GDPR?",
];

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
}

interface ChatContainerProps {
  onReady?: (openChat: (context: string, message: string) => void) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ onReady }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reopenTimerRef = useRef<number | null>(null);

  const lastScrollY = useRef(0);

  const { sendMessage: sendApiMessage, isLoading: apiLoading } = useChatApi();

  const handleMinimize = () => {
    setIsExpanded(false);
  };

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

  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsExpanded(true);

      const loadingMessageId = (Date.now() + 1).toString();
      const loadingMessage: Message = {
        id: loadingMessageId,
        text: "Thinking...",
        isUser: false,
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages(prev => [...prev, loadingMessage]);

      try {
        //Uses the API service to send the message
        const aiResponseHTML = await (apiLoading ? "Thinking..." : sendApiMessage(text.trim()));

        setMessages(prev => 
          prev.map(msg =>
            msg.id === loadingMessageId
            ? {
              ...msg,
              text: aiResponseHTML,
              isLoading: false,
            }
            : msg
          )
        );
      } catch (error) {
        console.error("Error calling AI API:", error);

        //Update the loading message to show an error
        setMessages(prev =>
          prev.map(msg =>
            msg.id === loadingMessageId
            ? {
              ...msg,
              // text: "Sorry, I'm having trouble processing your request. Please try again later.",
              text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'} Please try again later.`,
              isLoading: false,
              isError: true,
            }
            : msg
          )
        );
      }
      // Simulate AI response after a short delay
      // setTimeout(() => {
      //   const aiResponse: Message = {
      //     id: (Date.now() + 1).toString(),
      //     text: "Thank you for your message! I'm here to help you with AiprlAssist. How can I assist you further?",
      //     isUser: false,
      //     timestamp: new Date(),
      //   };
      //   setMessages(prev => [...prev, aiResponse]);
      // }, 1000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Close suggestions immediately
    setShowSuggestions(false);
    // Send the message
    handleSendMessage(suggestion);
  };

  // Function to open chat with context from buttons
  const openChatWithContext = React.useCallback((context: string, autoMessage: string) => {
    console.log('[ChatContainer] Opening with context:', context, 'Message:', autoMessage);
    
    // Open and expand the chat
    setIsOpen(true);
    setIsExpanded(true);
    
    // Auto-send the contextual message after a brief delay
    setTimeout(() => {
      handleSendMessage(autoMessage);
    }, 500);
  }, []);

  // Expose the openChatWithContext function to parent via onReady callback
  useEffect(() => {
    if (onReady && !hasCalledOnReady.current) {
      onReady(openChatWithContext);
      hasCalledOnReady.current = true;
    }
  }, [onReady, openChatWithContext]);

  // Clears timer if component unmounts
  useEffect(() => {
    return () => {
      if (reopenTimerRef.current) {
        window.clearTimeout(reopenTimerRef.current);
      }
    };
  }, []);

  // Handle scroll to make chat bar sticky and hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Make sticky after scrolling 20px
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Only apply smart scrolling when chat is NOT expanded
      if (!isExpanded) {
        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          // Scrolling down and past 100px
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up
          setIsVisible(true);
        }

        // Always show at the very top
        if (currentScrollY < 20) {
          setIsVisible(true);
        }
      } else {
        // When chat is expanded, always keep it visible
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isExpanded]);

  return (
    <>
      {isExpanded && (
        <div
          className={`fixed inset-0 h-screen w-screen bg-black/90 backdrop-blur-md transition-opacity duration-300 pointer-events-none ${
            isExpanded ? 'opacity-90 z-50' : 'opacity-60'
          }`}
          aria-hidden="true"
        />
      )}

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="chat-topdrop"
        unmountOnExit
        nodeRef={panelRef}
      >
        <div
          ref={panelRef}
          className={`fixed item-center shadow-lg shadow-orange-400/40 z-50 rounded-lg flex flex-col items-center justify-center transition-all duration-500 ease-in-out transform origin-top ${
            isScrolled ? 'top-0 duration-300' : 'lg:top-10 md:top-5 sm:top-5 top-4'
          } ${!isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} ${isExpanded
              ? 'w-[90%] lg:max-w-6xl h-[90vh] left-1/2 -translate-x-1/2 overflow-visible'
              : `w-[90%] lg:max-w-6xl left-1/2 -translate-x-1/2 overflow-visible ${isScrolled ? 'lg:mt-1 mt-2' : 'lg:mt-3 mt-10'}`
            }`}
        >
          {/* Chat messages - only show when expanded */}
          {isExpanded && (
            <div className="flex-1 w-full overflow-y-scroll scrollbar-thin bg-black shadow-xl shadow-orange-400/30 border border-orange-400/20 rounded-t-lg">
              <ChatMessages messages={messages} onMinimize={handleMinimize} />
            </div>
          )}

          {/* Input container */}
          <div className="relative w-full">
            {/* Suggestions dropdown on Default */}
            {showSuggestions && !isExpanded && (
              <div
                className="absolute top-full left-0 right-0 mb-2 z-[60]"
              >
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
              <div
                className="absolute bottom-full left-0 right-0 mt-2 z-[60]"
              >
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