import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

interface Step {
  title: string;
  description: string;
}

interface HowItWorksContent {
  eyebrow: string;
  headline: string;
  description: string;
  cta: { label: string; href: string };
  steps: Step[];
}

const CONTENT: HowItWorksContent = {
  eyebrow: 'From zero to moving',
  headline: 'A workspace your team understands instantly.',
  description:
    'Set up in minutes, invite your team, and make progress visible from day one. No complex configuration required.',
  cta: { label: 'Start building together', href: '/auth/sign-up' },
  steps: [
    {
      title: 'Create your organization',
      description: 'Give every team, client, or company a focused home.',
    },
    {
      title: 'Bring in your people',
      description:
        'Invite members and assign the right access in a few clicks.',
    },
    {
      title: 'Ship work that matters',
      description:
        'Create projects, clarify ownership, and keep momentum visible.',
    },
  ],
};

export default function HowItWorks() {
  const { eyebrow, headline, description, cta, steps } = CONTENT;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-y border-white/[0.07] bg-[#0a0a0a] py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-24 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {eyebrow}
          </p>

          <h2 className="mt-8 max-w-xl text-4xl font-bold leading-[1.1] tracking-[-0.04em] text-white sm:text-5xl">
            {headline}
          </h2>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-[#7a716a] sm:text-lg">
            {description}
          </p>

          <Link
            href={cta.href}
            className="mt-10 inline-flex items-center gap-2 border border-white/10 bg-white/3 px-6 py-3.5 text-base font-medium text-white transition hover:border-white/20 hover:bg-white/6 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/40"
          >
            {cta.label}
            <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
          </Link>
        </div>

        <ol className="relative flex flex-col gap-14 list-none">
          {/* Connecting line */}
          <span
            aria-hidden
            className="absolute bottom-0 left-4 top-4 w-px bg-white/10"
          />

          {steps.map(({ title, description: stepDescription }, i) => (
            <li key={title} className="relative flex gap-8">
              <span
                aria-hidden
                className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border border-accent/50 bg-[#0a0a0a]"
              >
                <span className="h-1.5 w-1.5 bg-accent" />
              </span>

              <div>
                <p className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  {title}
                </h3>
                <p className="mt-3 text-base text-[#7a716a]">
                  {stepDescription}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
