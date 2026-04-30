'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ToastContainer from '@/components/ui/Toast';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/useToast';

export default function LoginPage() {
  const [email, setEmail]         = useState('sarah@support.com');
  const [password, setPassword]   = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, toast, removeToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/agent');
    }
  }, [router]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      authService.saveSession(result.token, result.user);
      toast('Welcome, ' + result.user.name, 'success');
      setTimeout(() => router.push('/agent'), 500);
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
      <div className="w-[400px] bg-[var(--bg2)] border border-[var(--border2)] rounded-2xl p-10">

        <div className="text-center mb-8">
          <div className="w-[52px] h-[52px] mx-auto mb-4 bg-[var(--accent-glow)] border border-[var(--accent)]/30 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--accent2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <h1 className="text-[22px] font-semibold text-[var(--text)] mb-1.5">
            SupportAI
          </h1>
          <p className="text-sm text-[var(--text2)]">
            Agent portal — sign in to manage conversations
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="sarah@support.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleLogin}
            loading={isLoading}
            className="mt-2 w-full"
          >
            Sign in to dashboard
          </Button>
        </div>

        <div className="text-center mt-5 text-xs text-[var(--text3)]">
          Want to test as a customer?{' '}
          <button
            onClick={() => router.push('/customer')}
            className="text-[var(--accent2)] cursor-pointer hover:underline bg-transparent border-none"
          >
            Open customer chat →
          </button>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}