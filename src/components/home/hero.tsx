import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import DashboardPreview from './dashboard-preview';

interface HeroContent {
  badge: string;
  headlineLead: string;
  headlineTail: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  footnote: string;
}

const CONTENT: HeroContent = {
  badge: 'Built for teams that move',
  headlineLead: 'Turn ambitious work',
  headlineTail: 'into shared momentum.',
  description:
    'Workspora brings projects, people, and progress into one focused workspace. Plan clearly, collaborate quickly, and keep every team moving in the same direction.',
  primaryCta: { label: 'Create your workspace', href: '/auth/sign-up' },
  secondaryCta: { label: 'Explore the product', href: '/#features' },
  footnote: 'Free to start · No credit card required',
};

export default function Hero() {
  const {
    badge,
    headlineLead,
    headlineTail,
    description,
    primaryCta,
    secondaryCta,
    footnote,
  } = CONTENT;

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] pt-32 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-150 opacity-[0.05] mask-[linear-gradient(to_bottom,black,transparent)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px)',
          backgroundSize: '80px 100%',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-160 bg-linear-to-t from-accent/10 via-accent/3 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="flex items-center gap-2.5 border border-accent/30 bg-accent/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 bg-accent" />
            {badge}
          </p>

          <h1 className="mt-10 text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl lg:text-[90px]">
            {headlineLead}
            <span className="block text-[#7a716a]">{headlineTail}</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#7a716a] sm:text-lg">
            {description}
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              href={primaryCta.href}
              className="flex w-full items-center justify-center gap-2 bg-accent px-7 py-3.5 text-base font-semibold text-gray-950 transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
            >
              {primaryCta.label}
              <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
            </Link>
            <Link
              href={secondaryCta.href}
              className="w-full border border-white/10 bg-white/3 px-7 py-3.5 text-center text-base font-medium text-white transition hover:border-white/20 hover:bg-white/6 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/40 sm:w-auto"
            >
              {secondaryCta.label}
            </Link>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gray-700">
            {footnote}
          </p>
        </div>

        <div className="mt-16 sm:mt-24">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
