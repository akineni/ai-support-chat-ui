'use client';

import { useState } from 'react';
import CustomerHeader from '@/components/customer/CustomerHeader';
import OnboardingForm from '@/components/customer/OnboardingForm';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import QuickReplies from '@/components/chat/QuickReplies';
import ModeBanner from '@/components/chat/ModeBanner';
import ToastContainer from '@/components/ui/Toast';
import { useCustomerChat } from '@/hooks/useCustomerChat';

export default function CustomerPage() {
  const [inputValue, setInputValue] = useState('');

  const {
    messages,
    isTyping,
    isHumanMode,
    agentName,
    isStarting,
    isLoadingHistory,
    isMounted,
    isSending,
    files,
    conversationStarted,
    toasts,
    removeToast,
    messagesEndRef,
    startConversation,
    sendMessage,
    sendTyping,
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

  if (!isMounted) {
    return (
      <div className="flex h-screen bg-[var(--bg)] items-center justify-center">
        <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      <div className="flex flex-col w-full max-w-[680px] mx-auto h-full">

        <CustomerHeader
          onEndChat={endConversation}
          conversationStarted={conversationStarted}
        />

        {!conversationStarted ? (
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
            <ModeBanner mode={isHumanMode ? 'human' : 'ai'} />

            <MessageList
              messages={messages}
              isTyping={isTyping}
              isHumanMode={isHumanMode}
              agentName={agentName}
              messagesEndRef={messagesEndRef}
            />

            <MessageInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              onTyping={sendTyping}
              onFilesAdd={addFiles}
              onFileRemove={removeFile}
              files={files}
              disabled={isSending}
              placeholder="Type your message..."
            >
              <QuickReplies onSelect={handleQuickReply} />
            </MessageInput>
          </>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}