import axiosInstance from '@/lib/axios';
import { Agent } from '@/types';
import { STORAGE_KEYS } from '@/constants';

interface LoginResponse {
  token: string;
  user:  Agent;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });

    return response.data.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout');
    authService.clearSession();
  },

  saveSession(token: string, agent: Agent): void {
    localStorage.setItem(STORAGE_KEYS.AGENT_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AGENT_NAME,  agent.name);
    localStorage.setItem(STORAGE_KEYS.AGENT_UUID,  agent.uuid);
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.AGENT_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AGENT_NAME);
    localStorage.removeItem(STORAGE_KEYS.AGENT_UUID);
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AGENT_TOKEN);
  },

  getAgentName(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AGENT_NAME);
  },

  isAuthenticated(): boolean {
    return !!authService.getToken();
  },
};