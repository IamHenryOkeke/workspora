'use client';

import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { GoogleIcon } from '@hugeicons/core-free-icons';

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleLogin}
    >
      <HugeiconsIcon icon={GoogleIcon} size={18} className="mr-2" />
      Continue with Google
    </Button>
  );
}
