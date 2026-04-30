import { marked } from 'marked';
import { Message } from '@/types';
import AttachmentChip from '@/components/chat/AttachmentChip';

interface MessageBubbleProps {
  message:    Message;
  viewerType?: 'customer' | 'agent';
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour:   '2-digit',
    minute: '2-digit',
  });
}

marked.setOptions({ breaks: true, gfm: true });

const senderMeta = {
  customer: {
    label:       'Customer',
    initials:    'C',
    avatarClass: 'bg-[var(--bg4)] text-[var(--text2)] border-[var(--border2)]',
  },
  ai: {
    label:       'AI Support',
    initials:    'AI',
    avatarClass: 'bg-[var(--accent-glow)] text-[var(--accent2)] border-[var(--accent)]/30',
  },
  agent: {
    label:       'Agent',
    initials:    'AG',
    avatarClass: 'bg-[var(--green-bg)] text-[var(--green)] border-[var(--green)]/30',
  },
};

export default function MessageBubble({
  message,
  viewerType = 'customer',
}: MessageBubbleProps) {
  const meta = senderMeta[message.sender_type];

  // Message appears on the RIGHT if it was sent by the viewer
  // Customer view: customer messages go right
  // Agent view: agent messages go right
  const isOwnMessage =
    (viewerType === 'customer' && message.sender_type === 'customer') ||
    (viewerType === 'agent'    && message.sender_type === 'agent');

  // Override label for own messages
  const label = isOwnMessage ? 'You' : meta.label;
  const initials = isOwnMessage
    ? 'ME'
    : meta.initials;

  const renderBody = () => {
    if (!message.body) return '';
    if (message.sender_type === 'customer') return message.body;
    return marked.parse(message.body) as string;
  };

  return (
    <div className={`flex gap-2.5 animate-msg-in ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      <div className={`
        w-7 h-7 rounded-full border flex items-center justify-center
        text-[11px] font-medium flex-shrink-0 mt-0.5
        ${meta.avatarClass}
      `}>
        {initials}
      </div>

      <div className="max-w-[65%]">
        <div className={`
          text-[10px] text-[var(--text3)] mb-1 flex gap-1.5 items-center
          ${isOwnMessage ? 'justify-end' : ''}
        `}>
          <span className="font-medium text-[var(--text2)]">{label}</span>
          {formatTime(message.created_at)}
        </div>

        <div className={`
          px-3.5 py-2.5 text-[13px] leading-relaxed border
          ${isOwnMessage
            ? 'bg-[var(--accent)] border-transparent text-white rounded-xl rounded-tr-sm'
            : 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text)] rounded-sm rounded-tr-xl rounded-br-xl rounded-bl-xl'
          }
        `}>
          {message.sender_type === 'customer' ? (
            <span>{message.body}</span>
          ) : (
            <div
              className="message-markdown"
              dangerouslySetInnerHTML={{ __html: renderBody() }}
            />
          )}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {message.attachments.map((a, i) => (
              <AttachmentChip
                key={i}
                fileName={a.file_name}
                href={a.file_url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}