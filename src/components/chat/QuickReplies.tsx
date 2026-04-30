'use client';

import { useState } from 'react';
import { QUICK_REPLIES } from '@/constants';

interface QuickRepliesProps {
  onSelect: (text: string) => void;
}

export default function QuickReplies({ onSelect }: QuickRepliesProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-2.5">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="
          flex items-center gap-1.5 mb-2
          text-[11px] text-[var(--text3)]
          hover:text-[var(--text2)]
          transition-colors duration-150
          cursor-pointer bg-transparent border-none
        "
      >
        <svg
          className={`
            w-3 h-3 transition-transform duration-200
            ${isExpanded ? 'rotate-0' : 'rotate-180'}
          `}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
        Quick replies
      </button>

      <div className={`
        overflow-hidden transition-all duration-200
        ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="flex gap-1.5 flex-wrap">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => onSelect(reply)}
              className="
                px-3 py-1.5 rounded-full
                border border-[var(--border2)]
                bg-transparent text-[var(--text2)] text-xs
                hover:border-[var(--accent)] hover:text-[var(--accent2)]
                hover:bg-[var(--accent-glow)]
                transition-all duration-150 cursor-pointer
              "
            >
              {reply}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}