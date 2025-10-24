import { readEnv, requireEnv } from './env';

// Configuration utilities for environment variables

export interface AppConfig {
    chatApi: {
      url: string;
      timeout: number;
      debugMode: boolean;
    };
    app: {
      environment: string;
      isDevelopment: boolean;
      isProduction: boolean;
    };
  }
  
  class ConfigService {
    private config: AppConfig;
  
    constructor() {
      const mode = readEnv('NODE_ENV') || readEnv('MODE') || 'development';
  
      this.config = {
        chatApi: {
          url: requireEnv('VITE_CHAT_API_URL'),
          timeout: parseInt(readEnv('VITE_CHAT_API_TIMEOUT') || '30000', 10),
          debugMode: readEnv('VITE_CHAT_API_ENABLE_DEBUG') === 'true',
        },
        app: {
          environment: mode,
          isDevelopment: mode === 'development',
          isProduction: mode === 'production',
        },
      };
  
      this.validateConfig();
    }
  
    private validateConfig(): void {
      // Validate API URL format
      try {
        new URL(this.config.chatApi.url);
      } catch {
        throw new Error(`Invalid VITE_CHAT_API_URL format: ${this.config.chatApi.url}`);
      }
  
      // Validate timeout
      if (Number.isNaN(this.config.chatApi.timeout) || this.config.chatApi.timeout <= 0) {
        throw new Error('VITE_CHAT_API_TIMEOUT must be a positive number');
      }
  
      // Log configuration in development
      if (this.config.app.isDevelopment && this.config.chatApi.debugMode) {
        console.log('Configuration loaded:', {
          environment: this.config.app.environment,
          apiUrl: this.config.chatApi.url,
          timeout: this.config.chatApi.timeout,
          debugMode: this.config.chatApi.debugMode,
        });
      }
    }
  
    public getConfig(): AppConfig {
      return { ...this.config };
    }
  
    public getChatApiUrl(): string {
      return this.config.chatApi.url;
    }
  
    public getChatApiTimeout(): number {
      return this.config.chatApi.timeout;
    }
  
    public isDebugMode(): boolean {
      return this.config.chatApi.debugMode;
    }
  
    public isDevelopment(): boolean {
      return this.config.app.isDevelopment;
    }
  
    public isProduction(): boolean {
      return this.config.app.isProduction;
    }
  }
  
  // Create singleton instance
  const configService = new ConfigService();
  
  export default configService;
  
  // Export individual getters for convenience
  export const getChatApiUrl = () => configService.getChatApiUrl();
  export const getChatApiTimeout = () => configService.getChatApiTimeout();
  export const isDebugMode = () => configService.isDebugMode();
  export const isDevelopment = () => configService.isDevelopment();
  export const isProduction = () => configService.isProduction();
