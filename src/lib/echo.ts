// @ts-nocheck
import Pusher from 'pusher-js';
import { REVERB_CONFIG } from '@/constants';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    _echoInstance: any;
  }
}

export async function getEcho(): Promise<any> {
  // Use window-level singleton to survive React re-renders
  if (typeof window === 'undefined') {
    throw new Error('Echo can only be initialized on the client side.');
  }

  if (window._echoInstance) {
    return window._echoInstance;
  }

  window.Pusher = Pusher;

  const { default: Echo } = await import('laravel-echo');

  window._echoInstance = new Echo({
    broadcaster:       'reverb',
    key:               REVERB_CONFIG.appKey,
    wsHost:            REVERB_CONFIG.wsHost,
    wsPort:            REVERB_CONFIG.wsPort,
    wssPort:           REVERB_CONFIG.wssPort,
    forceTLS:          REVERB_CONFIG.scheme === 'https',
    enabledTransports: ['ws', 'wss'],
  });

  return window._echoInstance;
}

export function disconnectEcho(): void {
  if (typeof window !== 'undefined' && window._echoInstance) {
    window._echoInstance.disconnect();
    window._echoInstance = null;
  }
}