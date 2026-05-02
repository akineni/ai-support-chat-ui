'use client';

import { useEffect, useState } from 'react';
import { ToastType } from '@/hooks/useToast';

interface ToastItemProps {
  id: number;
  message: string;
  type: ToastType;
  onRemove: (id: number) => void;
}

function ToastItem({ id, message, type, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const colors = {
    success: 'border-green-500/40 text-[var(--green)]',
    error: 'border-red-500/40 text-red-400',
    info: 'border-[var(--border2)] text-[var(--text)]',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'i',
  };

  // const colors = {
  //   success: 'border-green-500/40 text-[var(--green)]',
  //   error: 'border-red-500/40 text-red-400',
  //   info: 'border-[var(--accent)]/40 text-[var(--accent2)]',
  // };

  // const icons = {
  //   success: '✓',
  //   error: '✕',
  //   info: '●',
  // };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3
        bg-[var(--bg3)] border rounded-lg
        text-sm shadow-lg
        transition-all duration-300
        ${colors[type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <span className="font-bold text-xs">{icons[type]}</span>
      <span>{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="ml-2 text-[var(--text3)] hover:text-[var(--text)] transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: { id: number; message: string; type: ToastType }[];
  onRemove: (id: number) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  );
}