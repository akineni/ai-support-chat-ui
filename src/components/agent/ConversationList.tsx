import { Conversation, ConversationFilter } from '@/types';
import ConversationItem from '@/components/agent/ConversationItem';
import FilterTabs from '@/components/agent/FilterTabs';

interface ConversationListProps {
  conversations:      Conversation[];
  activeUuid:         string | null;
  filter:             ConversationFilter;
  isLoading:          boolean;
  onSelect:           (conversation: Conversation) => void;
  onFilterChange:     (filter: ConversationFilter) => void;
  pendingCount:       number;
}

export default function ConversationList({
  conversations,
  activeUuid,
  filter,
  isLoading,
  onSelect,
  onFilterChange,
  pendingCount,
}: ConversationListProps) {
  return (
    <div className="
      w-[300px] flex-shrink-0 flex flex-col
      border-r border-[var(--border)]
      bg-[var(--bg2)]
    ">
      <div className="
        flex items-center justify-between
        px-4 py-5 border-b border-[var(--border)]
      ">
        <h2 className="text-sm font-medium text-[var(--text)]">
          Conversations
        </h2>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="
              text-[10px] font-medium px-2 py-0.5 rounded-full
              bg-[var(--amber-bg)] text-[var(--amber)]
              border border-[var(--amber)]/25
            ">
              {pendingCount} pending
            </span>
          )}
          <span className="
            text-[10px] font-medium px-2 py-0.5 rounded-full
            bg-[var(--accent-glow)] text-[var(--accent2)]
            border border-[var(--accent)]/25
            font-mono
          ">
            {conversations.length}
          </span>
        </div>
      </div>

      <FilterTabs active={filter} onChange={onFilterChange} />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-[var(--text3)] text-sm">
            Loading...
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-[var(--text3)]">
            <svg className="w-10 h-10 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-sm">No conversations</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.uuid}
              conversation={conv}
              isActive={activeUuid === conv.uuid}
              onClick={() => onSelect(conv)}
            />
          ))
        )}
      </div>
    </div>
  );
}