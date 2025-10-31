import React, { useEffect, useRef } from 'react';
import { IoPersonOutline, IoClose, IoSparklesOutline } from 'react-icons/io5';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    isLoading?: boolean;
    isError?: boolean;
}

interface ChatMessagesProps {
    messages: Message[];
    onMinimize: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, onMinimize }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const cleanAndRenderHTML = (content: string) => {
        // Extract HTML from code blocks (```html ... ```)
        const htmlBlockMatch = content.match(/```html\s*([\s\S]*?)```/);
        
        if (htmlBlockMatch) {
            // If HTML block found, use its content
            return { __html: htmlBlockMatch[1].trim() };
        }
        
        // Otherwise, strip code blocks and render as text
        const cleaned = content
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .trim();

        return { __html: cleaned };
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-orange-400/20">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 flex items-center justify-center">
                        <IoSparklesOutline className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-sm">AiprlAssist</h3>
                        <p className="text-gray-400 text-xs">AI Assistant</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400 text-xs">Online</span>
                {onMinimize && (
                    <button className="p-1 ml-5 rounded-full hover:bg-gray-700 cursor-pointer transition-colors duration-200" onClick={onMinimize} aria-label="Close chat">
                        <IoClose className="w-6 h-6 cursor-pointer text-gray-400 hover:text-white" />
                    </button>
                )}
                </div>
            </div>


            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.length === 0 ? (
                    <div className="flex overflow-y-scroll items-center justify-center h-full">
                        <div className="text-center">
                            <IoSparklesOutline className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">Start a conversation...</p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start space-x-3 animate-fadeInUp ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                                }`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isUser
                                ? 'bg-blue-500'
                                : 'bg-gradient-to-r from-orange-400 to-purple-500'
                                }`}>
                                {message.isUser ? (
                                    <IoPersonOutline className="w-4 h-4 text-white" />
                                ) : (
                                    <IoSparklesOutline className="w-4 h-4 text-white" />
                                )}
                            </div>

                            {/* Message bubble */}
                            <div className={`flex flex-col max-w-[80%] ${message.isUser ? 'items-end' : 'items-start'
                                }`}>
                                <div
                                    className={`px-4 py-2 rounded-2xl ${message.isUser
                                            ? 'bg-blue-500 text-white rounded-br-sm'
                                            : message.isError
                                                ? 'bg-red-900/50 text-red-200 rounded-bl-sm border border-red-400/20'
                                                : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-orange-400/20'
                                        }`}
                                >
                                    {message.isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm">AIprl is thinking</span>
                                            <div className="flex space-x-1">
                                                <div className="p-[2px] bg-orange-400 rounded-full animate-bounce"></div>
                                                <div className="p-[2px] bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="p-[2px] bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    ) : message.isUser ? (
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                    ) : (
                                        <div
                                            className="text-sm leading-relaxed ai-response"
                                            dangerouslySetInnerHTML={cleanAndRenderHTML(message.text)}
                                        />
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 mt-1 px-1">
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>
                            {/* <div className={`flex flex-col max-w-[80%] ${message.isUser ? 'items-end' : 'items-start'
                                }`}>
                                <div
                                    className={`px-4 py-2 rounded-2xl ${message.isUser
                                            ? 'bg-blue-500 text-white rounded-br-sm'
                                            : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-orange-400/20'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                </div>
                                <span className="text-xs text-gray-500 mt-1 px-1">
                                    {formatTime(message.timestamp)}
                                </span>
                            </div> */}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatMessages;