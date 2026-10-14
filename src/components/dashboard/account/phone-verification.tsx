'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError } from '@/components/ui/field';
import { UserService } from '@/services/user';
import { ApiResponse, User } from '@/lib/types';

type Step = 'view' | 'enter' | 'code';

const CODE_LENGTH = 6; // must match the code length configured in your Verify service
const RESEND_SECONDS = 30;

const labelClass = 'text-xs uppercase tracking-wider text-muted-foreground';

const sendPhoneCode = async (phoneNumber: string): Promise<ApiResponse> => {
  const { data } = await UserService.sendPhoneCode(phoneNumber);
  return data;
};

const verifyPhone = async (
  phoneNumber: string,
  code: string,
): Promise<ApiResponse> => {
  const { data } = await UserService.verifyPhone(phoneNumber, code);
  return data;
};

const formatPhone = (value: string) =>
  parsePhoneNumberFromString(value)?.formatInternational() ?? value;

export default function PhoneVerification({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const isVerified = Boolean(user.phoneVerifiedAt);

  const [step, setStep] = useState<Step>('view');
  const [input, setInput] = useState(''); // what the user typed
  const [target, setTarget] = useState(''); // E.164 number the code was sent to
  const [code, setCode] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const resetFlow = () => {
    setStep('view');
    setInput('');
    setTarget('');
    setCode('');
    setPhoneError(null);
    setCodeError(null);
    setCooldown(0);
  };

  const sendMutation = useMutation({
    mutationFn: sendPhoneCode,
    onSuccess: (_data, phone) => {
      setTarget(phone);
      setCode('');
      setCodeError(null);
      setStep('code');
      setCooldown(RESEND_SECONDS);
      toast.success('Verification code sent');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Failed to send code';
      const status = error.response?.status;
      if (step === 'enter' && (status === 400 || status === 409)) {
        setPhoneError(message);
        return;
      }
      toast.error(message);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: () => verifyPhone(target, code),
    onSuccess: async (data) => {
      toast.success(data.message || 'Phone number verified');
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      resetFlow();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      if (error.response?.status === 400) {
        setCodeError(message || 'That code is incorrect or has expired.');
        return;
      }
      toast.error(message || 'Failed to verify phone number');
    },
  });

  const handleSendFromInput = () => {
    setPhoneError(null);
    const parsed = parsePhoneNumberFromString(input);
    if (!parsed || !parsed.isValid()) {
      setPhoneError(
        'Enter a valid number including the country code, for example +1 555 010 2030.',
      );
      return;
    }
    if (isVerified && parsed.number === user.phoneNumber) {
      setPhoneError('This number is already verified on your account.');
      return;
    }
    sendMutation.mutate(parsed.number);
  };

  const handleVerify = () => {
    if (code.length === CODE_LENGTH && !verifyMutation.isPending) {
      verifyMutation.mutate();
    }
  };

  // Enter must not submit the surrounding profile form
  const onEnter = (action: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Field>
      <p className={labelClass}>Phone number</p>

      {step === 'view' && (
        <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm">
              {user.phoneNumber
                ? formatPhone(user.phoneNumber)
                : 'No phone number added'}
            </span>
            {user.phoneNumber && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                  isVerified
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-stone-500/10 text-stone-400'
                }`}
              >
                {isVerified ? 'Verified' : 'Unverified'}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {user.phoneNumber && !isVerified && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={sendMutation.isPending}
                onClick={() => sendMutation.mutate(user.phoneNumber!)}
              >
                {sendMutation.isPending ? 'Sending...' : 'Verify'}
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setInput('');
                setPhoneError(null);
                setStep('enter');
              }}
            >
              {user.phoneNumber ? 'Change' : 'Add number'}
            </Button>
          </div>
        </div>
      )}

      {step === 'enter' && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="tel"
              autoComplete="tel"
              autoFocus
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setPhoneError(null);
              }}
              onKeyDown={onEnter(handleSendFromInput)}
              aria-invalid={Boolean(phoneError)}
              placeholder="+1 (555) 010-2030"
            />
            <Button
              type="button"
              onClick={handleSendFromInput}
              disabled={!input.trim() || sendMutation.isPending}
            >
              {sendMutation.isPending ? 'Sending...' : 'Send code'}
            </Button>
            <Button type="button" variant="ghost" onClick={resetFlow}>
              Cancel
            </Button>
          </div>
          {phoneError ? (
            <FieldError errors={[{ message: phoneError }]} />
          ) : (
            <p className="text-xs text-muted-foreground">
              We&apos;ll text you a code to confirm this number is yours. It is
              only saved once verified.
            </p>
          )}
        </div>
      )}

      {step === 'code' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Enter the {CODE_LENGTH}-digit code sent to{' '}
            <span className="text-foreground">{formatPhone(target)}</span>.
          </p>
          <div className="flex gap-2">
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={CODE_LENGTH}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''));
                setCodeError(null);
              }}
              onKeyDown={onEnter(handleVerify)}
              aria-invalid={Boolean(codeError)}
              placeholder={'0'.repeat(CODE_LENGTH)}
              className="tracking-widest"
            />
            <Button
              type="button"
              onClick={handleVerify}
              disabled={code.length !== CODE_LENGTH || verifyMutation.isPending}
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
            </Button>
            <Button type="button" variant="ghost" onClick={resetFlow}>
              Cancel
            </Button>
          </div>
          {codeError && <FieldError errors={[{ message: codeError }]} />}

          <div className="flex gap-4 text-xs text-muted-foreground">
            <button
              type="button"
              className="underline disabled:no-underline disabled:opacity-50"
              disabled={cooldown > 0 || sendMutation.isPending}
              onClick={() => sendMutation.mutate(target)}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
            </button>
            <button
              type="button"
              className="underline"
              onClick={() => {
                setInput('');
                setPhoneError(null);
                setStep('enter');
              }}
            >
              Use a different number
            </button>
          </div>
        </div>
      )}
    </Field>
  );
}
