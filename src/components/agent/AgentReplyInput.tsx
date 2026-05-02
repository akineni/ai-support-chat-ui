'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import Button from '@/components/ui/Button';

interface AgentReplyInputProps {
  onSend:    (body: string) => void;
  isSending: boolean;
  onTyping:  (isTyping: boolean) => void;
}

export default function AgentReplyInput({
  onSend,
  isSending,
  onTyping,
}: AgentReplyInputProps) {
  const [body, setBody]  = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef      = useRef(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);

    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTyping(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!body.trim()) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTyping(false);
    }

    onSend(body);
    setBody('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--bg2)] flex-shrink-0">
      <div className="
        flex items-end gap-2.5 bg-[var(--bg3)]
        border border-[var(--border2)] rounded-xl px-3.5 py-2.5
        focus-within:border-[var(--accent)] transition-colors duration-150
      ">
        <textarea
          value={body}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Reply as agent... (Enter to send)"
          rows={1}
          disabled={isSending}
          className="
            flex-1 bg-transparent border-none outline-none resize-none
            text-[var(--text)] text-[13px] leading-relaxed
            placeholder:text-[var(--text3)]
            max-h-[120px] disabled:opacity-50
          "
        />
        <Button
          onClick={handleSend}
          loading={isSending}
          disabled={!body.trim()}
          size="sm"
          className="flex-shrink-0 !px-3 !py-1.5"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          Send
        </Button>
      </div>
    </div>
  );
}