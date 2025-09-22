import React, { useMemo, useState } from "react";
import Character01 from "../../assets/GraphicContent/Character01.png";
import type { ChatMessage } from "../../hooks/useChatBackend";

interface FullChatSystemProps {
  isVisible: boolean;
  onClose: () => void;
  onExpandToFullWidth: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  onSendMessage: (message: string) => Promise<void> | void;
}

function FullChatSystem({
  isVisible,
  onClose,
  onExpandToFullWidth,
  messages,
  isLoading,
  isTyping,
  onSendMessage,
}: FullChatSystemProps) {
  const [inputValue, setInputValue] = useState("");

  const hasUserMessages = useMemo(() => messages.some((msg) => msg.type === "user"), [messages]);

  if (!isVisible) return null;

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    await onSendMessage(trimmed);
    setInputValue("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = async (prompt: string) => {
    await onSendMessage(prompt);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 animate-fade-in">
      <div className="relative rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6 max-w-sm sm:w-[22rem] sm:h-[60dvh] h-[70dvh] shadow-2xl animate-gradient-subtle flex flex-col">
        <div className="absolute top-4 right-4 flex space-x-1 z-10">
          <button
            onClick={onExpandToFullWidth}
            className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 text-sm font-bold transition-colors duration-200"
            title="Expand to full width"
            type="button"
          >
            ⤢
          </button>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 text-lg font-bold transition-colors duration-200"
            type="button"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        {!hasUserMessages && (
          <>
            <div className="flex justify-center mb-4">
              <img src={Character01} alt="AiPRL assistant" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Ask Lukas.ai anything</h2>
            <p className="text-gray-600 text-center text-sm mb-4">What can I do for you?</p>
            <div className="space-y-2 mb-4 mt-12">
              <button
                onClick={() => handleQuickAction("Find best deals")}
                className="w-60 bg-white/70 hover:bg-white/90 text-gray-700 text-sm py-2 px-4 rounded-lg transition-all duration-200 text-left shadow-sm cursor-pointer disabled:opacity-50"
                disabled={isLoading}
                type="button"
              >
                Find best deals
              </button>
              <button
                onClick={() => handleQuickAction("Compare products")}
                className="w-52 bg-white/70 hover:bg-white/90 text-gray-700 text-sm py-2 px-4 rounded-lg transition-all duration-200 text-left shadow-sm cursor-pointer disabled:opacity-50"
                disabled={isLoading}
                type="button"
              >
                Compare products
              </button>
              <button
                onClick={() => handleQuickAction("Help me find something specific")}
                className="w-48 bg-white/70 hover:bg-white/90 text-gray-700 text-sm py-2 px-4 rounded-lg transition-all duration-200 text-left shadow-sm cursor-pointer disabled:opacity-50"
                disabled={isLoading}
                type="button"
              >
                Help me find something
              </button>
            </div>
          </>
        )}

        {hasUserMessages && (
          <>
            <div className="flex items-center space-x-3 mb-4">
              <img src={Character01} alt="Lukas AI" className="w-10 h-10 object-contain" />
              <div>
                <h2 className="text-lg font-bold text-gray-800">Lukas.ai</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>
              {messages.map((message, index) => (
                <div key={`${message.type}-${index}`} className={`flex ${message.type === "user" ? "justify-end" : "items-start space-x-2"}`}>
                  {message.type === "bot" && (
                    <img src={Character01} alt="Bot" className="w-6 h-6 object-contain bg-white rounded-full p-1 flex-shrink-0" />
                  )}
                  <div
                    className={`rounded-2xl p-3 max-w-[80%] shadow-sm ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-white/80 backdrop-blur-sm text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <img src={Character01} alt="Bot" className="w-6 h-6 object-contain bg-white rounded-full p-1 flex-shrink-0" />
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-auto">
          <div className="flex items-center bg-white text-black/80 rounded-full shadow-md">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about this store"
              className="flex-1 px-4 py-3 text-sm rounded-full border-none outline-none bg-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="p-3 text-pink-500 hover:text-pink-600 transition-colors duration-200 disabled:opacity-50"
              disabled={isLoading || !inputValue.trim()}
              type="button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullChatSystem;