// Custom hook for chat API integration
import { useState, useCallback } from 'react';
import chatApiService from '../services/chatApi';

export interface UseChatApiReturn {
  sendMessage: (query: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  testConnection: () => Promise<boolean>;
  retryLastQuery: () => Promise<void>;
}

export const useChatApi = (): UseChatApiReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(async (query: string): Promise<string> => {
    if (!query.trim()) {
      throw new Error('Message cannot be empty');
    }

    setIsLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const response = await chatApiService.sendQuery(query);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const isConnected = await chatApiService.testConnection();
      if (!isConnected) {
        setError('Failed to connect to chat API');
      }
      return isConnected;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryLastQuery = useCallback(async (): Promise<void> => {
    if (!lastQuery) {
      throw new Error('No previous query to retry');
    }
    await sendMessage(lastQuery);
  }, [lastQuery, sendMessage]);

  return {
    sendMessage,
    isLoading,
    error,
    clearError,
    testConnection,
    retryLastQuery,
  };
};