'use client';

import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeView:   'customer' | 'agent';
  onViewChange: (view: 'customer' | 'agent') => void;
  agentName:    string;
  pendingCount: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Sidebar({
  activeView,
  onViewChange,
  agentName,
  pendingCount,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm('Sign out?')) return;
    try {
      await authService.logout();
    } catch {
      authService.clearSession();
    }
    router.push('/login');
  };

  return (
    <div className="
      w-16 bg-[var(--bg2)] border-r border-[var(--border)]
      flex flex-col items-center py-5 gap-2 flex-shrink-0
    ">
      <div className="
        w-9 h-9 bg-[var(--accent)] rounded-[10px]
        flex items-center justify-center mb-4
      ">
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      </div>

      <button
        onClick={() => onViewChange('customer')}
        title="Customer Chat"
        className={`
          w-10 h-10 rounded-lg border-none flex items-center justify-center
          transition-all duration-150 cursor-pointer
          ${activeView === 'customer'
            ? 'bg-[var(--bg4)] text-[var(--accent2)]'
            : 'bg-transparent text-[var(--text3)] hover:bg-[var(--bg4)] hover:text-[var(--text)]'
          }
        `}
      >
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <button
        onClick={() => onViewChange('agent')}
        title="Agent Dashboard"
        className={`
          w-10 h-10 rounded-lg border-none flex items-center justify-center
          transition-all duration-150 cursor-pointer relative
          ${activeView === 'agent'
            ? 'bg-[var(--bg4)] text-[var(--accent2)]'
            : 'bg-transparent text-[var(--text3)] hover:bg-[var(--bg4)] hover:text-[var(--text)]'
          }
        `}
      >
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        {pendingCount > 0 && (
          <span className="
            absolute top-1.5 right-1.5 w-2 h-2 rounded-full
            bg-[var(--accent)] border-2 border-[var(--bg2)]
          " />
        )}
      </button>

      <div className="flex-1" />

      <button
        onClick={handleLogout}
        title="Sign out"
        className="
          w-8 h-8 rounded-full bg-[var(--bg4)]
          border border-[var(--border2)]
          flex items-center justify-center
          text-xs font-medium text-[var(--text2)]
          cursor-pointer hover:border-[var(--border)]
          transition-colors duration-150
        "
      >
        {agentName ? getInitials(agentName) : '?'}
      </button>
    </div>
  );
}