interface AttachmentChipProps {
  fileName:  string;
  onRemove?: () => void;
  href?:     string;
}

export default function AttachmentChip({
  fileName,
  onRemove,
  href,
}: AttachmentChipProps) {
  const inner = (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg4)] border border-[var(--border2)] rounded-md text-xs text-[var(--text2)]">
      <svg
        className="w-3 h-3 text-[var(--accent2)] flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span className="max-w-[120px] truncate">{fileName}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-[var(--text3)] hover:text-red-400 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="no-underline">
        {inner}
      </a>
    );
  }

  return inner;
}