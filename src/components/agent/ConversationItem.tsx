import { Conversation } from '@/types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive:     boolean;
  unreadCount:  number;
  onClick:      () => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour:   '2-digit',
    minute: '2-digit',
  });
}

const statusConfig = {
  pending_handover: {
    label:     'Needs attention',
    className: 'bg-[var(--amber-bg)] text-[var(--amber)]',
    dotClass:  'bg-[var(--amber)]',
  },
  open_human: {
    label:     'Human agent',
    className: 'bg-[var(--green-bg)] text-[var(--green)]',
    dotClass:  'bg-[var(--green)]',
  },
  open_ai: {
    label:     'AI handling',
    className: 'bg-[var(--accent-glow)] text-[var(--accent2)]',
    dotClass:  'bg-[var(--accent)]',
  },
  closed: {
    label:     'Closed',
    className: 'bg-[var(--bg4)] text-[var(--text3)]',
    dotClass:  'bg-[var(--text3)]',
  },
};

function getStatusConfig(conversation: Conversation) {
  if (conversation.status === 'pending_handover') return statusConfig.pending_handover;
  if (conversation.status === 'closed')           return statusConfig.closed;
  if (conversation.mode === 'human')              return statusConfig.open_human;
  return statusConfig.open_ai;
}

export default function ConversationItem({
  conversation,
  isActive,
  unreadCount,
  onClick,
}: ConversationItemProps) {
  const status = getStatusConfig(conversation);

  return (
    <div
      onClick={onClick}
      className={`
        px-4 py-3.5 border-b border-[var(--border)]
        cursor-pointer transition-colors duration-100
        ${isActive ? 'bg-[var(--bg4)]' : 'hover:bg-[var(--bg3)]'}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-[var(--text)] truncate">
          {conversation.customer_name}
        </span>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {unreadCount > 0 && (
            <span className="
              min-w-[18px] h-[18px] px-1
              rounded-full text-[10px] font-bold
              bg-[var(--accent)] text-white
              flex items-center justify-center
            ">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="text-[11px] text-[var(--text3)]">
            {formatTime(conversation.created_at)}
          </span>
        </div>
      </div>

      <div className="text-xs text-[var(--text2)] truncate max-w-[220px] mb-1.5">
        {conversation.customer_email || 'No email provided'}
      </div>

      <div className={`
        inline-flex items-center gap-1.5 text-[10px] font-medium
        px-2 py-0.5 rounded-full
        ${status.className}
      `}>
        <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
        {status.label}
      </div>
    </div>
  );
}