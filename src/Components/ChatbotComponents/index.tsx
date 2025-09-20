import { useState } from "react";
import { useChatBackend } from "../../hooks/useChatBackend";
import MessageIcon from "./MessageIcon";
import IconClickedShow from "./IconClickedShow";
import FullChatSystem from "./FullChatSystem";
import FullWidthChatWidget from "./FullWidthChatWidget";

const ChatbotDock = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isFullWidthVisible, setIsFullWidthVisible] = useState(false);

  const { messages, isLoading, isTyping, sendMessage } = useChatBackend();

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