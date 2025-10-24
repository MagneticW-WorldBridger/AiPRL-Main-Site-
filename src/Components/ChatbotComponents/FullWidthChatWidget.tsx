import React, { useMemo, useState } from "react";
import { FiMinimize2 } from "react-icons/fi";
import Character01 from "../../assets/GraphicContent/Character01.png";
import type { ChatMessage } from "../../hooks/useChatBackend";

interface FullWidthChatWidgetProps {
  isVisible: boolean;
  onClose: () => void;
  onMinimize: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  onSendMessage: (message: string) => Promise<void> | void;
}

function FullWidthChatWidget({
  isVisible,
  onMinimize,
  messages,
  isLoading,
  isTyping,
  onSendMessage,
}: FullWidthChatWidgetProps) {
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
    <div className="fixed inset-0 z-50 hidden sm:flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative top-16 bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 rounded-3xl mx-4 shadow-2xl max-w-6xl w-4/5 h-4/5 flex flex-col">
        <div className="flex items-center justify-between p-6 text-black/60">
          <div className="flex items-center space-x-4">
            <img src={Character01} alt="Lukas AI" className="w-12 h-12 object-contain bg-white/20 rounded-full p-1" />
            <div>
              <h2 className="text-xl font-bold">Lukas.ai Assistant</h2>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onMinimize}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
              title="Minimize"
              type="button"
            >
              <FiMinimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {!hasUserMessages && (
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <div className="text-6xl">✨</div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ask our AI anything</h2>
              </div>
              <div className="w-full max-w-4xl space-y-4">
                <p className="text-gray-600 text-sm font-medium mb-4">Suggestions on what to ask our AI</p>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => handleQuickAction("What can I ask you to do?")}
                    className="bg-white/70 hover:bg-white/90 text-gray-700 text-sm py-6 px-4 rounded-lg transition-all duration-200 text-left shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                    disabled={isLoading}
                    type="button"
                  >
                    What can I ask you to do?
                  </button>
                  <button
                    onClick={() => handleQuickAction("Help me find the best products for my needs")}
                    className="bg-white/70 hover:bg-white/90 text-gray-700 text-sm py-6 px-4 rounded-lg transition-all duration-200 text-left shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                    disabled={isLoading}
                    type="button"
                  >
                    Help me find the best products for my needs
                  </button>
                  <button
                    onClick={() => handleQuickAction("Compare different products and help me choose")}
                    className="bg-white/70 hover:bg-white/90 text-gray-700 text-sm py-6 px-4 rounded-lg transition-all duration-200 text-left shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                    disabled={isLoading}
                    type="button"
                  >
                    Compare different products and help me choose
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasUserMessages && (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={`${message.type}-${index}`} className={`flex ${message.type === "user" ? "justify-end" : "items-start space-x-3"}`}>
                  {message.type === "bot" && (
                    <img src={Character01} alt="Bot" className="w-8 h-8 object-contain bg-white rounded-full p-1" />
                  )}
                  <div
                    className={`rounded-2xl p-4 shadow-md max-w-md ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-white/80 backdrop-blur-sm text-gray-800"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-3">
                  <img src={Character01} alt="Bot" className="w-8 h-8 object-contain bg-white rounded-full p-1" />
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-3 backdrop-blur-sm">
          <div className="flex items-center bg-white rounded-full shadow-lg">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about your projects"
              className="flex-1 pl-6 pr-3 py-4 text-gray-800 rounded-full border-none outline-none bg-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="text-black/50 rounded-full transition-all duration-200 transform mr-2 disabled:opacity-50"
              disabled={isLoading || !inputValue.trim()}
              type="button"
            >
              <svg className="sm:w-7 sm:h-7 w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullWidthChatWidget;