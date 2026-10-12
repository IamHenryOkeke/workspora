'use client';

import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BackButton({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  const navigate = useRouter();

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center gap-1 text-white/70 hover:text-white text-xs cursor-pointer mb-4"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        <p>{title}</p>
      </Link>
    );
  }

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
