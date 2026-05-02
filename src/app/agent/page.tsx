'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAgentDashboard } from '@/hooks/useAgentDashboard';
import { useCustomerChat } from '@/hooks/useCustomerChat';
import Sidebar from '@/components/agent/Sidebar';
import ConversationList from '@/components/agent/ConversationList';
import AgentChatHeader from '@/components/agent/AgentChatHeader';
import AgentMessageList from '@/components/agent/AgentMessageList';
import AgentReplyInput from '@/components/agent/AgentReplyInput';
import ModeBanner from '@/components/chat/ModeBanner';
import TypingIndicator from '@/components/chat/TypingIndicator';
import CustomerHeader from '@/components/customer/CustomerHeader';
import OnboardingForm from '@/components/customer/OnboardingForm';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import QuickReplies from '@/components/chat/QuickReplies';
import ToastContainer from '@/components/ui/Toast';

type ActiveView = 'customer' | 'agent';

export default function AgentPage() {
  const router                        = useRouter();
  const [activeView, setActiveView]   = useState<ActiveView>('agent');
  const [agentName, setAgentName]     = useState('');
  const [inputValue, setInputValue]   = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.replace('/login');
      return;
    }
    setAgentName(authService.getAgentName() || '');
  }, [router]);

  const {
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
    toasts: agentToasts,
    removeToast: removeAgentToast,
    messagesEndRef,
    changeFilter,
    selectConversation,
    takeover,
    release,
    sendReply,
    sendTyping: sendAgentTyping,
    loadMessages,
    unreadCounts,
  } = useAgentDashboard();

  const {
    messages: customerMessages,
    isTyping,
    isHumanMode: isCustHumanMode,
    agentName:   custAgentName,
    isStarting,
    isLoadingHistory,
    isMounted: isCustMounted,
    isSending: isCustSending,
    files,
    conversationStarted,
    toasts: customerToasts,
    removeToast: removeCustomerToast,
    messagesEndRef: custMessagesEndRef,
    startConversation,
    sendMessage,
    sendTyping: sendCustomerTyping,
    endConversation,
    addFiles,
    removeFile,
  } = useCustomerChat();

  const handleSend = () => {
    if (!inputValue.trim() && files.length === 0) return;
    sendMessage(inputValue, files);
    setInputValue('');
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
  };

  const activeToasts      = activeView === 'agent' ? agentToasts : customerToasts;
  const activeRemoveToast = activeView === 'agent' ? removeAgentToast : removeCustomerToast;

  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        agentName={agentName}
        pendingCount={pendingCount}
      />

      {/* ---- AGENT DASHBOARD VIEW ---- */}
      {activeView === 'agent' && (
        <div className="flex flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            activeUuid={activeConversation?.uuid || null}
            filter={filter}
            isLoading={isLoadingConvs}
            unreadCounts={unreadCounts}
            onSelect={selectConversation}
            onFilterChange={changeFilter}
            pendingCount={pendingCount}
          />

          <div className="flex flex-col flex-1 overflow-hidden">
            {activeConversation ? (
              <>
                <AgentChatHeader
                  conversation={activeConversation}
                  onTakeover={takeover}
                  onRelease={release}
                  onRefresh={() => loadMessages(activeConversation.uuid)}
                  isTakingOver={isTakingOver}
                  isReleasing={isReleasing}
                />

                <ModeBanner
                  mode={activeConversation.mode}
                  status={activeConversation.status}
                />

                <AgentMessageList
                  messages={messages}
                  isLoading={isLoadingMsgs}
                  messagesEndRef={messagesEndRef}
                />

                {customerIsTyping && (
                  <div className="px-5 py-2 border-t border-[var(--border)] bg-[var(--bg2)]">
                    <TypingIndicator
                      senderType="customer"
                      senderName={activeConversation.customer_name}
                    />
                  </div>
                )}

                {activeConversation.mode === 'human' && (
                  <AgentReplyInput
                    onSend={sendReply}
                    isSending={isSending}
                    onTyping={sendAgentTyping}
                  />
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--text3)]">
                <svg className="w-10 h-10 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-sm">Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- CUSTOMER CHAT VIEW ---- */}
      {activeView === 'customer' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-col w-full max-w-[680px] mx-auto h-full">

            <CustomerHeader
              onEndChat={endConversation}
              conversationStarted={conversationStarted}
            />

            {!isCustMounted ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !conversationStarted ? (
              <OnboardingForm
                onStart={startConversation}
                isLoading={isStarting}
              />
            ) : isLoadingHistory ? (
              <div className="flex-1 flex items-center justify-center text-[var(--text3)] text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  Loading your conversation...
                </div>
              </div>
            ) : (
              <>
                <ModeBanner mode={isCustHumanMode ? 'human' : 'ai'} />

                <MessageList
                  messages={customerMessages}
                  isTyping={isTyping}
                  isHumanMode={isCustHumanMode}
                  agentName={custAgentName}
                  messagesEndRef={custMessagesEndRef}
                />

                <MessageInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSend}
                  onTyping={sendCustomerTyping}
                  onFilesAdd={addFiles}
                  onFileRemove={removeFile}
                  files={files}
                  disabled={isCustSending}
                  placeholder="Type your message..."
                >
                  <QuickReplies onSelect={handleQuickReply} />
                </MessageInput>
              </>
            )}
          </div>
        </div>
      )}

      <ToastContainer toasts={activeToasts} onRemove={activeRemoveToast} />
    </div>
  );
}