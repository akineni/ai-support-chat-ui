import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?:    'sm' | 'md';
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2 font-medium
    transition-all duration-150 cursor-pointer border
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
  `;

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
  };

  const variants = {
    primary: `
      bg-[var(--accent)] border-transparent text-white
      hover:opacity-90
    `,
    outline: `
      bg-transparent border-[var(--border2)] text-[var(--text2)]
      hover:border-[var(--accent)] hover:text-[var(--accent2)]
      hover:bg-[var(--accent-glow)]
    `,
    danger: `
      bg-transparent border-[var(--border2)] text-[var(--text2)]
      hover:border-red-500 hover:text-red-500
      hover:bg-red-500/10
    `,
    ghost: `
      bg-transparent border-transparent text-[var(--text2)]
      hover:bg-[var(--bg4)] hover:text-[var(--text)]
    `,
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : children}
    </button>
  );
}