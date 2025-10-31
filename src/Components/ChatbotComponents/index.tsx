import { useState, useCallback, useEffect, useRef } from "react";
import { useChatBackend } from "../../hooks/useChatBackend";
import MessageIcon from "./MessageIcon";
import IconClickedShow from "./IconClickedShow";
import FullChatSystem from "./FullChatSystem";
import FullWidthChatWidget from "./FullWidthChatWidget";

interface ChatbotDockProps {
  onReady?: (openChat: (context: string, message: string) => void) => void;
}

const ChatbotDock = ({ onReady }: ChatbotDockProps) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isFullWidthVisible, setIsFullWidthVisible] = useState(false);
  const [entryContext, setEntryContext] = useState<string | null>(null);

  const { messages, isLoading, isTyping, sendMessage } = useChatBackend();
  const hasCalledOnReady = useRef(false);

  const handleMessageIconClick = () => {
    if (isChatVisible || isFullWidthVisible) {
      setIsPopupVisible(false);
      setIsChatVisible(false);
      setIsFullWidthVisible(false);
    } else if (isPopupVisible) {
      setIsPopupVisible(false);
    } else {
      setIsPopupVisible(true);
    }
  };

  const handleClosePopup = () => setIsPopupVisible(false);

  const handleChatClick = () => {
    setIsPopupVisible(false);
    setIsChatVisible(true);
  };

  const handleCloseChatSystem = () => setIsChatVisible(false);

  const handleExpandToFullWidth = () => {
    setIsChatVisible(false);
    setIsFullWidthVisible(true);
  };

  const handleCloseFullWidth = () => setIsFullWidthVisible(false);

  const handleMinimizeFullWidth = () => {
    setIsFullWidthVisible(false);
    setIsChatVisible(true);
  };

  // Function to open chat with context - exposed to parent
  const openChatWithContext = useCallback((context: string, autoMessage: string) => {
    console.log('[ChatbotDock] Opening with context:', context, 'Message:', autoMessage);
    setEntryContext(context);
    
    // Open full-width chat for button clicks (better UX)
    setIsPopupVisible(false);
    setIsChatVisible(false);
    setIsFullWidthVisible(true);
    
    // Auto-send the contextual message
    setTimeout(() => {
      sendMessage(autoMessage);
    }, 500); // Small delay for smooth animation
  }, [sendMessage]);

  // Expose the openChatWithContext function to parent
  useEffect(() => {
    if (onReady && !hasCalledOnReady.current) {
      onReady(openChatWithContext);
      hasCalledOnReady.current = true;
    }
  }, [onReady, openChatWithContext]);

  return (
    <>
      <MessageIcon
        onClick={handleMessageIconClick}
        isPopupVisible={isPopupVisible || isChatVisible || isFullWidthVisible}
      />

      <IconClickedShow
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
        onChatClick={handleChatClick}
      />

      <FullChatSystem
        isVisible={isChatVisible}
        onClose={handleCloseChatSystem}
        onExpandToFullWidth={handleExpandToFullWidth}
        messages={messages}
        isLoading={isLoading}
        isTyping={isTyping}
        onSendMessage={sendMessage}
      />

      <FullWidthChatWidget
        isVisible={isFullWidthVisible}
        onClose={handleCloseFullWidth}
        onMinimize={handleMinimizeFullWidth}
        messages={messages}
        isLoading={isLoading}
        isTyping={isTyping}
        onSendMessage={sendMessage}
      />
    </>
  );
};

export default ChatbotDock;