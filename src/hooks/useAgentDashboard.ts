import { useState, useCallback, useEffect, useRef } from 'react';
import { Conversation, Message, ConversationFilter } from '@/types';
import { agentService } from '@/services/agentService';
import { useToast } from '@/hooks/useToast';
import { getEcho, disconnectEcho } from '@/lib/echo.config';

let agentDashboardSubscribed = false;

export function useAgentDashboard() {
  const [conversations, setConversations]           = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages]                     = useState<Message[]>([]);
  const [filter, setFilter]                         = useState<ConversationFilter>('all');
  const [isLoadingConvs, setIsLoadingConvs]         = useState(false);
  const [isLoadingMsgs, setIsLoadingMsgs]           = useState(false);
  const [isSending, setIsSending]                   = useState(false);
  const [isTakingOver, setIsTakingOver]             = useState(false);
  const [isReleasing, setIsReleasing]               = useState(false);
  const [customerIsTyping, setCustomerIsTyping]     = useState(false);
  const [unreadCounts, setUnreadCounts]             = useState<Record<string, number>>({});
  const { toasts, toast, removeToast }              = useToast();

  const activeUuidRef  = useRef<string | null>(null);
  const filterRef      = useRef<ConversationFilter>('all');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  // -------------------------------------------------------
  // Unread counts
  // -------------------------------------------------------
  const loadUnreadCounts = useCallback(async () => {
    try {
      const counts = await agentService.getUnreadCounts();
      setUnreadCounts(counts);
    } catch {
      // Silently fail — non critical
    }
  }, []);

  // -------------------------------------------------------
  // Conversations
  // -------------------------------------------------------
  const loadConversations = useCallback(async (
    currentFilter: ConversationFilter
  ) => {
    setIsLoadingConvs(true);
    try {
      const result = await agentService.getConversations(currentFilter);
      setConversations(result.data);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to load conversations', 'error');
    } finally {
      setIsLoadingConvs(false);
    }
  }, [toast]);

  const changeFilter = useCallback((newFilter: ConversationFilter) => {
    setFilter(newFilter);
    filterRef.current = newFilter;
    loadConversations(newFilter);
  }, [loadConversations]);

  // -------------------------------------------------------
  // Messages
  // -------------------------------------------------------
  const loadMessages = useCallback(async (uuid: string) => {
    setIsLoadingMsgs(true);
    try {
      const result = await agentService.getMessages(uuid);
      setMessages(result.data);
      scrollToBottom();
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to load messages', 'error');
    } finally {
      setIsLoadingMsgs(false);
    }
  }, [toast, scrollToBottom]);

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
    scrollToBottom();
  }, [scrollToBottom]);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    activeUuidRef.current = conversation.uuid;
    setActiveConversation(conversation);
    setCustomerIsTyping(false);

    // Clear unread count locally immediately on open
    setUnreadCounts((prev) => ({ ...prev, [conversation.uuid]: 0 }));

    await loadMessages(conversation.uuid);
    // loadMessages hits getMessages which marks as read on backend
  }, [loadMessages]);

  // -------------------------------------------------------
  // Agent Actions
  // -------------------------------------------------------
  const takeover = useCallback(async () => {
    if (!activeConversation) return;
    setIsTakingOver(true);
    try {
      const updated = await agentService.takeover(activeConversation.uuid);
      setActiveConversation(updated);
      toast('Conversation taken over', 'success');
      await loadConversations(filterRef.current);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Takeover failed', 'error');
    } finally {
      setIsTakingOver(false);
    }
  }, [activeConversation, loadConversations, toast]);

  const release = useCallback(async () => {
    if (!activeConversation) return;
    setIsReleasing(true);
    try {
      const updated = await agentService.release(activeConversation.uuid);
      setActiveConversation(updated);
      toast('Released back to AI', 'success');
      await loadConversations(filterRef.current);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Release failed', 'error');
    } finally {
      setIsReleasing(false);
    }
  }, [activeConversation, loadConversations, toast]);

  const sendReply = useCallback(async (body: string) => {
    if (!activeConversation || !body.trim()) return;
    setIsSending(true);
    try {
      await agentService.reply(activeConversation.uuid, body);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Failed to send reply', 'error');
    } finally {
      setIsSending(false);
    }
  }, [activeConversation, toast]);

  const sendTyping = useCallback(async (isTyping: boolean) => {
    if (!activeConversation) return;
    await agentService.sendTyping(activeConversation.uuid, isTyping);
  }, [activeConversation]);

  // -------------------------------------------------------
  // Reverb — module-level guard
  // -------------------------------------------------------
  const subscribeToAgentDashboard = useCallback(async () => {
    if (agentDashboardSubscribed) return;
    agentDashboardSubscribed = true;

    try {
      const echo = await getEcho();

      echo.leave('agent.dashboard');

      echo.channel('agent.dashboard')
        .listen('.message.sent', (data: {
          conversation_uuid: string;
          message: Message & { conversation_id: number };
        }) => {
          const msg = data.message;

          loadConversations(filterRef.current);

          if (
            activeUuidRef.current &&
            data.conversation_uuid === activeUuidRef.current
          ) {
            // Active conversation — append message directly
            appendMessage(msg);
          } else if (msg.sender_type === 'customer') {
            // Non-active conversation — increment unread count
            setUnreadCounts((prev) => ({
              ...prev,
              [data.conversation_uuid]: (prev[data.conversation_uuid] || 0) + 1,
            }));
          }
        })
        .listen('.user.typing', (data: {
          conversation_uuid: string;
          sender_type:       string;
          is_typing:         boolean;
        }) => {
          if (
            data.sender_type === 'customer' &&
            data.conversation_uuid === activeUuidRef.current
          ) {
            setCustomerIsTyping(data.is_typing);
          }
        })
        .listen('.conversation.taken_over', (data: { conversation_uuid: string }) => {
          if (filterRef.current !== 'all') {
            setFilter('all');
            filterRef.current = 'all';
          }

          loadConversations('all');
          toast('A conversation needs your attention', 'info');

          if (activeUuidRef.current === data.conversation_uuid) {
            setActiveConversation((prev) =>
              prev ? { ...prev, status: 'pending_handover' } : prev
            );
          }
        })
        .listen('.conversation.released', (data: { conversation_uuid: string }) => {
          loadConversations(filterRef.current);

          if (activeUuidRef.current === data.conversation_uuid) {
            setActiveConversation((prev) =>
              prev ? { ...prev, mode: 'ai' } : prev
            );
          }
        });

    } catch (e) {
      agentDashboardSubscribed = false;
      console.error('Reverb agent subscription failed:', e);
    }
  }, [appendMessage, loadConversations, toast]);

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

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [scrollToBottom]);

  // -------------------------------------------------------
  // Init
  // -------------------------------------------------------
  useEffect(() => {
    loadConversations('all');
    loadUnreadCounts();
    subscribeToAgentDashboard();

    return () => {
      agentDashboardSubscribed = false;
      disconnectEcho();
    };
  }, []);

  const pendingCount = conversations.filter(
    (c) => c.status === 'pending_handover'
  ).length;

  return {
    conversations,
    activeConversation,
    messages,
    filter,
    isLoadingConvs,
    isLoadingMsgs,
    isSending,
    isTakingOver,
    isReleasing,
    pendingCount,
    customerIsTyping,
    unreadCounts,
    toasts,
    toast,
    removeToast,
    messagesEndRef,
    loadConversations,
    changeFilter,
    selectConversation,
    takeover,
    release,
    sendReply,
    sendTyping,
    loadMessages,
  };
}