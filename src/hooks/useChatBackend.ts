import { useCallback, useEffect, useRef, useState } from "react";

export type ChatMessage = {
  id?: string;
  type: "user" | "bot";
  content: string;
  createdAt?: string;
};

interface BackendResponse {
  messages?: ChatMessage[];
  reply?: string;
  message?: string;
}

const MESSAGES_ENDPOINT = "/api/chat/messages";

export const useChatBackend = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const normalizeResponse = useCallback((payload: BackendResponse | BackendResponse[] | string | undefined): ChatMessage[] => {
    if (!payload) {
      return [];
    }

    if (typeof payload === "string") {
      return [{ type: "bot", content: payload }];
    }

    if (Array.isArray(payload)) {
      return payload.flatMap((item) => normalizeResponse(item));
    }

    if (Array.isArray(payload.messages)) {
      return payload.messages;
    }

    if (payload.reply) {
      return [{ type: "bot", content: payload.reply }];
    }

    if (payload.message) {
      return [{ type: "bot", content: payload.message }];
    }

    return [];
  }, []);

  const fetchMessages = useCallback(async () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;
    setIsLoading(true);

    try {
      const response = await fetch(MESSAGES_ENDPOINT, {
        method: "GET",
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const payload = (await response.json()) as BackendResponse | BackendResponse[] | string | undefined;
      setMessages(normalizeResponse(payload));
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Failed to load chat messages", error);
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
      setIsLoading(false);
    }
  }, [normalizeResponse]);

  useEffect(() => {
    fetchMessages();
    return () => {
      controllerRef.current?.abort();
    };
  }, [fetchMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const userMessage: ChatMessage = {
        type: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const response = await fetch(MESSAGES_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ message: trimmed }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status}`);
        }

        const payload = (await response.json()) as BackendResponse | BackendResponse[] | string | undefined;
        const botMessages = normalizeResponse(payload);

        if (botMessages.length) {
          setMessages((prev) => [...prev, ...botMessages.map((message) => ({
            ...message,
            type: message.type ?? "bot",
          }))]);
        }
      } catch (error) {
        console.error("Chat message failed", error);
      } finally {
        setIsTyping(false);
      }
    },
    [normalizeResponse]
  );

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    refresh: fetchMessages,
  };
};