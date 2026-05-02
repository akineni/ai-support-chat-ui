import axiosInstance from '@/lib/axios';
import { Conversation, Message, PaginatedResponse } from '@/types';

export const chatService = {
  async startConversation(
    customerName: string,
    customerEmail?: string
  ): Promise<{ session_token: string; conversation: Conversation }> {
    const response = await axiosInstance.post('/chat', {
      customer_name:  customerName,
      customer_email: customerEmail || undefined,
    });

    return response.data.data;
  },

  async getHistory(sessionToken: string): Promise<PaginatedResponse<Message>> {
    const response = await axiosInstance.get(
      `/chat/${sessionToken}/messages`
    );

    return response.data;
  },

  async sendMessage(
    sessionToken: string,
    body: string,
    files: File[] = []
  ): Promise<Message> {
    const formData = new FormData();
    if (body) formData.append('body', body);
    files.forEach((f, i) => formData.append(`attachments[${i}]`, f));

    const response = await axiosInstance.post(
      `/chat/${sessionToken}/messages`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.data;
  },

  async sendTyping(sessionToken: string, isTyping: boolean): Promise<void> {
    try {
      await axiosInstance.post(`/chat/${sessionToken}/typing`, {
        is_typing: isTyping,
      });
    } catch {
      // Silently fail — typing is non-critical
    }
  },
};