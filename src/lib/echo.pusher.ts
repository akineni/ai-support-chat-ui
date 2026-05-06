// @ts-nocheck
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    _echoInstance: any;
  }
}

export async function getEcho(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Echo can only be initialized on the client side.');
  }

  if (window._echoInstance) {
    return window._echoInstance;
  }

  window.Pusher = Pusher;

  const { default: Echo } = await import('laravel-echo');

  window._echoInstance = new Echo({
    broadcaster: 'pusher',
    key:         process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster:     process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS:    true,
  });

  return window._echoInstance;
}

export function disconnectEcho(): void {
  if (typeof window !== 'undefined' && window._echoInstance) {
    window._echoInstance.disconnect();
    window._echoInstance = null;
  }
}