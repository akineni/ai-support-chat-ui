import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { chatService } from '@/services/chatService';
import { useToast } from '@/hooks/useToast';
import { getEcho, disconnectEcho } from '@/lib/echo.config';

const SESSION_KEYS = {
  TOKEN:      'customer_session_token',
  UUID:       'customer_conversation_uuid',
  HUMAN_MODE: 'customer_human_mode',
};

export function useCustomerChat() {
  const [sessionToken, setSessionToken]               = useState<string | null>(null);
  const [conversationUuid, setConversationUuid]       = useState<string | null>(null);
  const [messages, setMessages]                       = useState<Message[]>([]);
  const [isTyping, setIsTyping]                       = useState(false);
  const [isHumanMode, setIsHumanMode]                 = useState(false);
  const [agentName, setAgentName]                     = useState<string>('');
  const [isStarting, setIsStarting]                   = useState(false);
  const [isSending, setIsSending]                     = useState(false);
  const [isLoadingHistory, setIsLoadingHistory]       = useState(false);
  const [files, setFiles]                             = useState<File[]>([]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isMounted, setIsMounted]                     = useState(false);
  const { toasts, toast, removeToast }                = useToast();
  const messagesEndRef                                = useRef<HTMLDivElement | null>(null);
  const isHumanModeRef                                = useRef(false);
  const isSubscribedRef                               = useRef(false);
  const sessionTokenRef                               = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      const exists = prev.some(
        (m) => m.created_at === message.created_at &&
               m.sender_type === message.sender_type &&
               m.body === message.body
      );
      if (exists) return prev;
      return [...prev, message];
    });
    setTimeout(scrollToBottom, 50);
  }, [scrollToBottom]);

  // -------------------------------------------------------
  // Session persistence
  // -------------------------------------------------------
  const saveSession = useCallback((token: string, uuid: string) => {
    localStorage.setItem(SESSION_KEYS.TOKEN, token);
    localStorage.setItem(SESSION_KEYS.UUID,  uuid);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEYS.TOKEN);
    localStorage.removeItem(SESSION_KEYS.UUID);
    localStorage.removeItem(SESSION_KEYS.HUMAN_MODE);
  }, []);

  // -------------------------------------------------------
  // Load history
  // -------------------------------------------------------
  const loadHistory = useCallback(async (token: string) => {
    setIsLoadingHistory(true);
    try {
      const result = await chatService.getHistory(token);
      setMessages(result.data);
      scrollToBottom();
    } catch {
      clearSession();
      setConversationStarted(false);
      setSessionToken(null);
      setConversationUuid(null);
      sessionTokenRef.current = null;
    } finally {
      setIsLoadingHistory(false);
    }
  }, [scrollToBottom, clearSession]);

  // -------------------------------------------------------
  // Subscribe to Reverb — once only
  // -------------------------------------------------------
  const subscribeToConversation = useCallback(async (uuid: string) => {
    if (isSubscribedRef.current) return;
    isSubscribedRef.current = true;

    try {
      const echo = await getEcho();

      echo.leave(`conversation.${uuid}`);

      echo.channel(`conversation.${uuid}`)
        .listen('.message.sent', (data: { message: Message }) => {
          const msg = data.message;
          if (msg.sender_type === 'ai' || msg.sender_type === 'agent') {
            setIsTyping(false);
            appendMessage(msg);
          }
        })
        .listen('.user.typing', (data: {
          conversation_uuid: string;
          sender_type: string;
          is_typing: boolean;
        }) => {
          if (data.sender_type === 'agent' && isHumanModeRef.current) {
            setIsTyping(data.is_typing);
          }
        })
        .listen('.conversation.taken_over', (data: {
          conversation_uuid: string;
          assigned_agent: { id: number; name: string } | null;
        }) => {
          isHumanModeRef.current = true;
          setIsHumanMode(true);
          setIsTyping(false);
          if (data.assigned_agent?.name) {
            setAgentName(data.assigned_agent.name);
          }
          localStorage.setItem(SESSION_KEYS.HUMAN_MODE, 'true');
          toast('You are now connected with a human agent', 'info');
        })
        .listen('.conversation.released', () => {
          isHumanModeRef.current = false;
          setIsHumanMode(false);
          setIsTyping(false);
          setAgentName('');
          localStorage.setItem(SESSION_KEYS.HUMAN_MODE, 'false');
          toast('You are now connected with our AI assistant', 'info');
        });
    } catch (e) {
      isSubscribedRef.current = false;
      console.error('Reverb connection failed:', e);
    }
  }, [appendMessage, toast]);

  // -------------------------------------------------------
  // Mount — restore session
  // -------------------------------------------------------
  useEffect(() => {
    setIsMounted(true);

    const token     = localStorage.getItem(SESSION_KEYS.TOKEN);
    const uuid      = localStorage.getItem(SESSION_KEYS.UUID);
    const humanMode = localStorage.getItem(SESSION_KEYS.HUMAN_MODE) === 'true';

    if (token && uuid) {
      setSessionToken(token);
      sessionTokenRef.current = token;
      setConversationUuid(uuid);
      setConversationStarted(true);
      setIsLoadingHistory(true);
      isHumanModeRef.current = humanMode;
      setIsHumanMode(humanMode);
      loadHistory(token);
      subscribeToConversation(uuid);
    }
  }, []);

  // -------------------------------------------------------
  // Scroll to bottom when tab becomes visible
  // -------------------------------------------------------
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        scrollToBottom();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [scrollToBottom]);

  // -------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------
  useEffect(() => {
    return () => {
      isSubscribedRef.current = false;
      disconnectEcho();
    };
  }, []);

  // -------------------------------------------------------
  // Start conversation
  // -------------------------------------------------------
  const startConversation = useCallback(async (
    name: string,
    email: string,
    firstMessage: string
  ) => {
    if (!name.trim() || !firstMessage.trim()) {
      toast('Please enter your name and message', 'error');
      return;
    }

    setIsStarting(true);

    try {
      const result = await chatService.startConversation(name, email);
      setSessionToken(result.session_token);
      sessionTokenRef.current = result.session_token;
      setConversationUuid(result.conversation.uuid);
      setConversationStarted(true);
      saveSession(result.session_token, result.conversation.uuid);
      await subscribeToConversation(result.conversation.uuid);
      await sendMessage(firstMessage, [], result.session_token);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to start conversation', 'error');
    } finally {
      setIsStarting(false);
    }
  }, [toast, subscribeToConversation, saveSession]);

  // -------------------------------------------------------
  // Send message
  // -------------------------------------------------------
  const sendMessage = useCallback(async (
    body: string,
    attachments: File[] = [],
    token?: string
  ) => {
    const activeToken = token || sessionTokenRef.current;
    if (!activeToken) return;
    if (!body.trim() && attachments.length === 0) return;

    setIsSending(true);

    const optimisticMessage: Message = {
      sender_type: 'customer',
      body,
      is_read:     false,
      attachments: [],
      created_at:  new Date().toISOString(),
    };

    appendMessage(optimisticMessage);

    if (!isHumanModeRef.current) {
      setIsTyping(true);
    }

    try {
      await chatService.sendMessage(activeToken, body, attachments);
      setFiles([]);
    } catch (e: unknown) {
      setIsTyping(false);
      toast(e instanceof Error ? e.message : 'Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  }, [appendMessage, toast]);

  // -------------------------------------------------------
  // Send typing event
  // -------------------------------------------------------
  const sendTyping = useCallback(async (isTyping: boolean) => {
    const activeToken = sessionTokenRef.current;
    if (!activeToken) return;
    await chatService.sendTyping(activeToken, isTyping);
  }, []);

  // -------------------------------------------------------
  // End conversation
  // -------------------------------------------------------
  const endConversation = useCallback(() => {
    clearSession();
    disconnectEcho();
    isSubscribedRef.current = false;
    isHumanModeRef.current  = false;
    sessionTokenRef.current = null;
    setSessionToken(null);
    setConversationUuid(null);
    setMessages([]);
    setConversationStarted(false);
    setIsTyping(false);
    setIsHumanMode(false);
    setAgentName('');
    setFiles([]);
  }, [clearSession]);

  // -------------------------------------------------------
  // File handling
  // -------------------------------------------------------
  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    sessionToken,
    conversationUuid,
    messages,
    isTyping,
    isHumanMode,
    agentName,
    isStarting,
    isSending,
    isLoadingHistory,
    isMounted,
    files,
    conversationStarted,
    toasts,
    toast,
    removeToast,
    messagesEndRef,
    startConversation,
    sendMessage,
    sendTyping,
    endConversation,
    addFiles,
    removeFile,
  };
}