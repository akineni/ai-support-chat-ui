import { useRef, useEffect } from 'react';
import { Message } from '@/types';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';

interface MessageListProps {
  messages:        Message[];
  isTyping?:       boolean;
  isHumanMode?:    boolean;
  agentName?:      string;
  messagesEndRef?: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({
  messages,
  isTyping    = false,
  isHumanMode = false,
  agentName,
  messagesEndRef,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef  = useRef<HTMLDivElement>(null);
  const endRef       = messagesEndRef || internalRef;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-[11px] text-[var(--text3)]">
        <div className="flex-1 h-px bg-[var(--border)]" />
        Today
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <div ref={containerRef} className="flex flex-col gap-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isTyping && (
          <TypingIndicator
            senderType={isHumanMode ? 'agent' : 'ai'}
            senderName={isHumanMode ? agentName : undefined}
          />
        )}
      </div>

      <div ref={endRef as React.RefObject<HTMLDivElement>} />
    </div>
  );
}