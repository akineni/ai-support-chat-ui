'use client';

import { useRef, KeyboardEvent, ChangeEvent } from 'react';
import AttachmentChip from '@/components/chat/AttachmentChip';
import { ALLOWED_FILE_TYPES } from '@/constants';

interface MessageInputProps {
  value:        string;
  onChange:     (val: string) => void;
  onSend:       () => void;
  onTyping?:    (isTyping: boolean) => void;
  onFilesAdd:   (files: File[]) => void;
  onFileRemove: (index: number) => void;
  files:        File[];
  placeholder?: string;
  disabled?:    boolean;
  children?:    React.ReactNode;
}

export default function MessageInput({
  value,
  onChange,
  onSend,
  onTyping,
  onFilesAdd,
  onFileRemove,
  files,
  placeholder = 'Type your message...',
  disabled    = false,
  children,
}: MessageInputProps) {
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef      = useRef(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';

    if (onTyping) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        onTyping(true);
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        onTyping(false);
      }, 2000);
    }
  };

  const handleSend = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (isTypingRef.current && onTyping) {
      isTypingRef.current = false;
      onTyping(false);
    }

    onSend();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAdd(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--bg2)] flex-shrink-0">
      {children}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {files.map((f, i) => (
            <AttachmentChip
              key={i}
              fileName={f.name}
              onRemove={() => onFileRemove(i)}
            />
          ))}
        </div>
      )}

      <div className="
        flex items-end gap-2.5 bg-[var(--bg3)]
        border border-[var(--border2)] rounded-xl px-3.5 py-2.5
        focus-within:border-[var(--accent)] transition-colors duration-150
      ">
        <textarea
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="
            flex-1 bg-transparent border-none outline-none resize-none
            text-[var(--text)] text-[13px] leading-relaxed
            placeholder:text-[var(--text3)]
            max-h-[120px] disabled:opacity-50
          "
        />

        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="
            w-7 h-7 rounded-lg flex items-center justify-center
            text-[var(--text3)] hover:text-[var(--text2)]
            hover:bg-[var(--bg4)] cursor-pointer transition-all duration-150
          ">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ALLOWED_FILE_TYPES}
              onChange={handleFileChange}
              className="hidden"
            />
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </label>

          <button
            onClick={handleSend}
            disabled={disabled || (!value.trim() && files.length === 0)}
            className="
              w-8 h-8 rounded-lg bg-[var(--accent)] text-white
              flex items-center justify-center flex-shrink-0
              hover:opacity-85 transition-opacity duration-150
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}