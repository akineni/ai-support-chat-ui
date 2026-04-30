interface AvatarProps {
  name:       string;
  size?:      'sm' | 'md' | 'lg';
  variant?:   'default' | 'ai' | 'agent' | 'customer';
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-10 h-10 text-sm',
};

const variants = {
  default:  'bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]',
  ai:       'bg-[var(--accent-glow)] text-[var(--accent2)] border border-[var(--accent)]/30',
  agent:    'bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green)]/30',
  customer: 'bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({
  name,
  size    = 'md',
  variant = 'default',
}: AvatarProps) {
  return (
    <div
      className={`
        rounded-full flex items-center justify-center
        font-medium flex-shrink-0
        ${sizes[size]}
        ${variants[variant]}
      `}
    >
      {getInitials(name)}
    </div>
  );
}