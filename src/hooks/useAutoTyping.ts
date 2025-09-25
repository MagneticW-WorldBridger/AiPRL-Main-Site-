import { useState, useEffect, useRef } from 'react';

interface AutoTypingOptions {
  messages: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenMessages?: number;
  loop?: boolean;
}

const useAutoTyping = ({
  messages,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenMessages = 1500,
  loop = true,
}: AutoTypingOptions) => {
  const [currentText, setCurrentText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleTyping = () => {
      const fullMessage = messages[messageIndex];
      setCurrentText(
        isDeleting
          ? fullMessage.substring(0, currentText.length - 1)
          : fullMessage.substring(0, currentText.length + 1)
      );

      if (!isDeleting && currentText === fullMessage) {
        // Done typing, start deleting after a delay
        timeoutRef.current = setTimeout(() => setIsDeleting(true), delayBetweenMessages);
      } else if (isDeleting && currentText === '') {
        // Done deleting, move to next message or loop
        setIsDeleting(false);
        setMessageIndex((prev) => (loop ? (prev + 1) % messages.length : prev + 1));
        if (!loop && messageIndex === messages.length - 1) {
          // If not looping and last message finished, stop.
          clearTimeout(timeoutRef.current!);
        }
      }
    };

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    timeoutRef.current = setTimeout(handleTyping, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentText, isDeleting, messageIndex, messages, typingSpeed, deletingSpeed, delayBetweenMessages, loop]);

  return currentText;
};

export default useAutoTyping;