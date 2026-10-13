import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

interface CtaContent {
  eyebrow: string;
  headline: string;
  description: string;
  button: { label: string; href: string };
}

const CONTENT: CtaContent = {
  eyebrow: 'Your best work starts here',
  headline: 'Make progress feel inevitable.',
  description: 'Start your workspace today. Bring your team tomorrow.',
  button: { label: 'Get started for free', href: '/auth/sign-up' },
};

export default function Cta() {
  const { eyebrow, headline, description, button } = CONTENT;

  return (
    <section className="border-t border-white/[0.07] bg-[#0a0a0a] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </p>

        <h2 className="mt-8 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          {headline}
        </h2>

        <p className="mt-6 text-base text-[#7a716a] sm:text-lg">
          {description}
        </p>

        <Link
          href={button.href}
          className="mt-12 flex items-center gap-2 bg-accent px-8 py-4 text-base font-semibold text-gray-950 transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {button.label}
          <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
        </Link>
      </div>
    </section>
  );
}
