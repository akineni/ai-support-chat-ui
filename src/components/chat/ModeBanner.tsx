interface ModeBannerProps {
  mode:    'ai' | 'human';
  status?: 'open' | 'pending_handover' | 'closed';
}

export default function ModeBanner({ mode, status }: ModeBannerProps) {
  const isHuman   = mode === 'human';
  const isPending = status === 'pending_handover';

  const label = isHuman
    ? 'Human agent is handling this conversation'
    : isPending
      ? 'Customer requested human agent — take over to reply'
      : 'AI assistant is responding to your messages';

  return (
    <div
      className={`
        flex items-center gap-2 px-5 py-2 text-xs flex-shrink-0
        border-b border-[var(--border)]
        ${isHuman
          ? 'bg-[var(--green-bg)] text-[var(--green)]'
          : 'bg-[var(--accent-glow)] text-[var(--accent2)]'
        }
      `}
    >
      <span className={`
        w-1.5 h-1.5 rounded-full flex-shrink-0
        ${isHuman ? 'bg-[var(--green)]' : 'bg-[var(--accent)]'}
      `} />
      {label}
    </div>
  );
}