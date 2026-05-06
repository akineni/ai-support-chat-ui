// @ts-nocheck
import { getEcho as getEchoReverb, disconnectEcho as disconnectEchoReverb } from './echo';
import { getEcho as getEchoPusher, disconnectEcho as disconnectEchoPusher } from './echo.pusher';

const isPusher = process.env.NEXT_PUBLIC_BROADCASTER === 'pusher';

export const getEcho = isPusher ? getEchoPusher : getEchoReverb;
export const disconnectEcho = isPusher ? disconnectEchoPusher : disconnectEchoReverb;