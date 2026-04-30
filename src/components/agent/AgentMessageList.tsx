import { useRef, useEffect } from 'react';
import { Message } from '@/types';
import MessageBubble from '@/components/chat/MessageBubble';

interface AgentMessageListProps {
  messages:       Message[];
  isLoading:      boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function AgentMessageList({
  messages,
  isLoading,
  messagesEndRef,
}: AgentMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--text3)] text-sm">
        Loading messages...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--text3)] text-sm">
        No messages yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-[11px] text-[var(--text3)]">
        <div className="flex-1 h-px bg-[var(--border)]" />
        Today
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <div ref={containerRef} className="flex flex-col gap-4">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            viewerType="agent"
          />
        ))}
      </div>

      <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
    </div>
  );
}