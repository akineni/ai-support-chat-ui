'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface OnboardingFormProps {
  onStart:   (name: string, email: string, firstMessage: string) => void;
  isLoading: boolean;
}

export default function OnboardingForm({ onStart, isLoading }: OnboardingFormProps) {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [firstMessage, setFirstMessage] = useState('');

  const handleSubmit = () => {
    onStart(name, email, firstMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="
      px-6 py-6 flex flex-col gap-3
      border-b border-[var(--border)]
      bg-[var(--bg2)] flex-shrink-0
    ">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
          How can we help you today?
        </h3>
        <p className="text-sm text-[var(--text2)]">
          Start a conversation with our support team. We are here to help.
        </p>
      </div>

      <div className="flex gap-2.5">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Input
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Input
        placeholder="What do you need help with?"
        value={firstMessage}
        onChange={(e) => setFirstMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Button
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!name.trim() || !firstMessage.trim()}
        className="mt-1"
      >
        Start conversation
      </Button>
    </div>
  );
}