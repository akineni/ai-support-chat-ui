import { ConversationFilter } from '@/types';
import { CONVERSATION_FILTERS } from '@/constants';

interface FilterTabsProps {
  active:   ConversationFilter;
  onChange: (filter: ConversationFilter) => void;
}

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1.5 px-3 py-2.5 border-b border-[var(--border)]">
      {CONVERSATION_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value as ConversationFilter)}
          className={`
            px-2.5 py-1 rounded-full border text-[11px] font-medium
            transition-all duration-150 cursor-pointer
            ${active === f.value
              ? 'bg-[var(--accent-glow)] border-[var(--accent)]/40 text-[var(--accent2)]'
              : 'border-[var(--border2)] text-[var(--text2)] hover:border-[var(--accent)]/40 hover:text-[var(--accent2)] hover:bg-[var(--accent-glow)]'
            }
          `}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}