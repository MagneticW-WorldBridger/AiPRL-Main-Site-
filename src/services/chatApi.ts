import { readEnv, requireEnv } from '../utils/env';

// Chat API Service
// This service handles all API calls to your n8n webhook

interface ChatApiResponse {
    output: string;
  }
  
  interface ChatApiRequest {
    query: string;
  }
  
  class ChatApiService {
    private apiUrl: string;
    private timeout: number;
    private debugMode: boolean;
  
    constructor() {
      // Get API configuration from environment variables
      this.apiUrl = requireEnv('VITE_CHAT_API_URL');
      this.timeout = parseInt(readEnv('VITE_CHAT_API_TIMEOUT') || '30000', 10);
      this.debugMode = readEnv('VITE_CHAT_API_ENABLE_DEBUG') === 'true';
  
      if (this.debugMode) {
        console.log('ChatApiService initialized with URL:', this.apiUrl);
      }
    }
  
    /**
     * Send a query to the chat API and get AI response
     */
    async sendQuery(query: string): Promise<string> {
      if (!query.trim()) {
        throw new Error('Query cannot be empty');
      }
  
      if (this.debugMode) {
        console.log('Sending query to API:', query);
      }
  
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
  
      try {
        const requestBody: ChatApiRequest = { query: query.trim() };
  
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
  
        const data: ChatApiResponse[] = await response.json();
  
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid response format from API');
        }
  
        const aiResponse = data[0]?.output;
        
        if (!aiResponse) {
          throw new Error('No output received from API');
        }
  
        if (this.debugMode) {
          console.log('Received API response:', aiResponse);
        }
  
        return aiResponse;
  
      } catch (error) {
        clearTimeout(timeoutId);
  
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(`Request timed out after ${this.timeout / 1000} seconds`);
          }
          throw error;
        }
  
        throw new Error('An unexpected error occurred while calling the API');
      }
    }
  
    /**
     * Test API connection
     */
    async testConnection(): Promise<boolean> {
      try {
        await this.sendQuery('Hello, can you hear me?');
        return true;
      } catch (error) {
        if (this.debugMode) {
          console.error('API connection test failed:', error);
        }
        return false;
      }
    }
  
    /**
     * Get API configuration info
     */
    getConfig() {
      return {
        apiUrl: this.apiUrl,
        timeout: this.timeout,
        debugMode: this.debugMode,
      };
    }
  }
  
  // Create singleton instance
  const chatApiService = new ChatApiService();
  
  export default chatApiService;
