export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const REVERB_CONFIG = {
  appKey:  process.env.NEXT_PUBLIC_REVERB_APP_KEY || '',
  wsHost:  process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
  wsPort:  Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
  wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
  scheme:  process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http',
};

export const STORAGE_KEYS = {
  AGENT_TOKEN: 'agent_token',
  AGENT_NAME:  'agent_name',
  AGENT_UUID:  'agent_uuid',
};

export const ALLOWED_FILE_TYPES =
  '.jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.zip';

export const MAX_FILES      = 5;
export const MAX_FILE_SIZE  = 10240;

export const QUICK_REPLIES = [
  'What is my current pension balance?',
  'I want to update my contribution rate',
  'When will I receive my statement?',
  'Speak to a human agent please',
];

export const CONVERSATION_FILTERS = [
  { label: 'All',     value: 'all'              },
  { label: 'Pending', value: 'pending_handover'  },
  { label: 'Open',    value: 'open'              },
  { label: 'Closed',  value: 'closed'            },
] as const;

export const POLL_INTERVAL_MS = 15000;