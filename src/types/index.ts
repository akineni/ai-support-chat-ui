export interface Conversation {
  uuid: string;
  customer_name: string;
  customer_email: string | null;
  status: 'open' | 'pending_handover' | 'closed';
  mode: 'ai' | 'human';
  assigned_agent: {
    id: number;
    name: string;
  } | null;
  taken_over_at: string | null;
  created_at: string;
}

export interface Attachment {
  file_url: string;
  file_name: string;
  file_type: string;
  file_extension: string;
  file_size: number;
  is_image: boolean;
  created_at: string;
}

export interface Message {
  id?: number;
  sender_type: 'customer' | 'ai' | 'agent';
  body: string | null;
  is_read: boolean;
  attachments: Attachment[];
  created_at: string;
}

export interface Agent {
  uuid: string;
  name: string;
  email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    next: string | null;
    prev: string | null;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export type ConversationFilter = 'all' | 'open' | 'pending_handover' | 'closed';