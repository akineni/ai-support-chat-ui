import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-[var(--text2)] uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-[var(--bg3)] border border-[var(--border2)]
          rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)]
          placeholder:text-[var(--text3)]
          outline-none transition-colors duration-150
          focus:border-[var(--accent)]
          ${className}
        `}
        {...props}
      />
    </div>
  );
}