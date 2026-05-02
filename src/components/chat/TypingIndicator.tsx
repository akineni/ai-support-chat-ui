interface TypingIndicatorProps {
  senderType?: 'ai' | 'agent' | 'customer';
  senderName?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const avatarStyles = {
  ai:       'bg-[var(--accent-glow)] text-[var(--accent2)] border border-[var(--accent)]/30',
  agent:    'bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green)]/30',
  customer: 'bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]',
};

export default function TypingIndicator({
  senderType = 'ai',
  senderName,
}: TypingIndicatorProps) {
  const initials = senderType === 'ai'
    ? 'AI'
    : senderName
      ? getInitials(senderName)
      : senderType === 'agent' ? 'AG' : 'C';

  const label = senderType === 'ai'
    ? 'AI Support'
    : senderName || (senderType === 'agent' ? 'Agent' : 'Customer');

  return (
    <div className="flex gap-2.5 animate-msg-in">
      <div className={`
        w-7 h-7 rounded-full flex items-center justify-center
        text-[11px] font-medium flex-shrink-0 mt-0.5
        ${avatarStyles[senderType]}
      `}>
        {initials}
      </div>
      <div className="max-w-[65%]">
        <div className="text-[10px] text-[var(--text3)] mb-1 flex gap-1.5 items-center">
          <span className="font-medium text-[var(--text2)]">{label}</span>
          typing...
        </div>
        <div className="flex items-center gap-1 px-3.5 py-2.5 bg-[var(--bg3)] border border-[var(--border)] rounded-sm rounded-tr-xl rounded-br-xl rounded-bl-xl w-fit">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[var(--text3)] animate-typing"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}