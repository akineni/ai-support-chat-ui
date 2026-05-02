import { Conversation } from '@/types';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

interface AgentChatHeaderProps {
  conversation:  Conversation;
  onTakeover:    () => void;
  onRelease:     () => void;
  onRefresh:     () => void;
  isTakingOver:  boolean;
  isReleasing:   boolean;
}

export default function AgentChatHeader({
  conversation,
  onTakeover,
  onRelease,
  onRefresh,
  isTakingOver,
  isReleasing,
}: AgentChatHeaderProps) {
  const isHuman = conversation.mode === 'human';

  return (
    <div className="
      flex items-center justify-between
      px-5 py-4 border-b border-[var(--border)]
      bg-[var(--bg2)] flex-shrink-0
    ">
      <div className="flex items-center gap-3">
        <Avatar name={conversation.customer_name} size="md" />
        <div>
          <p className="text-sm font-medium text-[var(--text)]">
            {conversation.customer_name}
          </p>
          <p className="text-xs text-[var(--text2)] font-mono truncate max-w-[220px]">
            {conversation.uuid}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isHuman ? (
          <Button
            variant="danger"
            size="sm"
            onClick={onRelease}
            loading={isReleasing}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Release to AI
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onTakeover}
            loading={isTakingOver}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Take Over
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          ↻ Refresh
        </Button>
      </div>
    </div>
  );
}