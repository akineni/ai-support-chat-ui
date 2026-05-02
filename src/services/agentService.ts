import axiosInstance from '@/lib/axios';
import {
  Conversation,
  Message,
  PaginatedResponse,
  ConversationFilter,
} from '@/types';

export const agentService = {
  async getConversations(
    filter: ConversationFilter = 'all',
    perPage: number = 20
  ): Promise<PaginatedResponse<Conversation>> {
    const params: Record<string, string | number> = { per_page: perPage };
    if (filter !== 'all') params.status = filter;

    const response = await axiosInstance.get(
      '/agent/conversations',
      { params }
    );

    return response.data;
  },

  async getMessages(uuid: string): Promise<PaginatedResponse<Message>> {
    const response = await axiosInstance.get(
      `/agent/conversations/${uuid}/messages`
    );

    return response.data;
  },

  async takeover(uuid: string): Promise<Conversation> {
    const response = await axiosInstance.post(
      `/agent/conversations/${uuid}/takeover`
    );

    return response.data.data;
  },

  async release(uuid: string): Promise<Conversation> {
    const response = await axiosInstance.post(
      `/agent/conversations/${uuid}/release`
    );

    return response.data.data;
  },

  async reply(uuid: string, body: string): Promise<Message> {
    const response = await axiosInstance.post(
      `/agent/conversations/${uuid}/reply`,
      { body }
    );

    return response.data.data;
  },

  async sendTyping(uuid: string, isTyping: boolean): Promise<void> {
    try {
      await axiosInstance.post(`/agent/conversations/${uuid}/typing`, {
        is_typing: isTyping,
      });
    } catch {
      // Silently fail — typing is non-critical
    }
  },

  async getUnreadCounts(): Promise<Record<string, number>> {
    const response = await axiosInstance.get('/agent/conversations/unread-counts');
    return response.data.data;
  },
};