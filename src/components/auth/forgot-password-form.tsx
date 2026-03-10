'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { handleSubmit, control, formState } = useForm<
    z.infer<typeof forgotPasswordSchema>
  >({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (!res.ok) {
      toast.error(resData.error || 'An error occurred during log in');
    } else {
      toast.success(resData.message || 'Password reset link sent');
      router.push('/auth/login');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password to Workspora</CardTitle>
        <CardDescription>
          Enter your email below to request a password reset link.
        </CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/auth/login">Go back</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="m@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="forgot-password-form"
          className="w-full"
          disabled={formState.isSubmitting}
        >
          Send Reset Link
        </Button>
      </CardFooter>
    </Card>
  );
}
