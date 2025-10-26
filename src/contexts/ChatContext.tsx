import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface ChatContextType {
  openChatWithContext: (entryContext: string, autoMessage: string) => void;
  isOpen: boolean;
  entryContext: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
  onOpenChat: (entryContext: string, autoMessage: string) => void;
}

export const ChatProvider = ({ children, onOpenChat }: ChatProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [entryContext, setEntryContext] = useState<string | null>(null);

  const openChatWithContext = useCallback((context: string, message: string) => {
    console.log('[ChatContext] Opening chat with context:', context);
    setEntryContext(context);
    setIsOpen(true);
    onOpenChat(context, message);
  }, [onOpenChat]);

  return (
    <ChatContext.Provider value={{ openChatWithContext, isOpen, entryContext }}>
      {children}
    </ChatContext.Provider>
  );
};

