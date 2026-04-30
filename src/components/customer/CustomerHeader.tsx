interface CustomerHeaderProps {
  onEndChat?:          () => void;
  conversationStarted?: boolean;
}

export default function CustomerHeader({
  onEndChat,
  conversationStarted = false,
}: CustomerHeaderProps) {
  const handleEnd = () => {
    if (confirm('Are you sure you want to end this conversation? Your chat history will be cleared.')) {
      onEndChat?.();
    }
  };

  return (
    <div className="
      flex items-center gap-3.5 px-6 py-5
      border-b border-[var(--border)]
      bg-[var(--bg2)] flex-shrink-0
    ">
      <div className="relative">
        <div className="
          w-10 h-10 rounded-xl
          bg-[var(--accent-glow)] border border-[var(--accent)]/30
          flex items-center justify-center
        ">
          <svg
            className="w-5 h-5 text-[var(--accent2)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
          </svg>
        </div>
        <span className="
          absolute -bottom-0.5 -right-0.5
          w-2.5 h-2.5 rounded-full
          bg-[var(--green)]
          border-2 border-[var(--bg2)]
        " />
      </div>

      <div className="flex-1">
        <h2 className="text-[15px] font-semibold text-[var(--text)]">
          Support Team
        </h2>
        <p className="text-xs text-[var(--green)]">
          ● Online — usually replies instantly
        </p>
      </div>

      {conversationStarted && onEndChat && (
        <button
          onClick={handleEnd}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            text-xs text-[var(--text3)]
            border border-[var(--border2)] rounded-lg
            hover:border-red-500/50 hover:text-red-400
            hover:bg-red-500/10
            transition-all duration-150 cursor-pointer
            bg-transparent
          "
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          End chat
        </button>
      )}
    </div>
  );
}