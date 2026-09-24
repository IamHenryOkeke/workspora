'use client';

import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';

export default function BackButton({ title }: { title: string }) {
  const navigate = useRouter();

  return (
    <button
      onClick={() => navigate.back()}
      className="flex items-center gap-1 text-white/70 hover:text-white text-xs cursor-pointer mb-4"
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
      <p>{title}</p>
    </button>
  );
}
