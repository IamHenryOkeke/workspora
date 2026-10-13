import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface SecurityContent {
  eyebrow: string;
  headline: string;
  description: string;
  features: string[];
}

const CONTENT: SecurityContent = {
  eyebrow: 'Secure by design',
  headline: 'Your team\u2019s work belongs to your team.',
  description:
    'Granular roles, controlled invitations, and member approval flows protect every workspace without getting in the way.',
  features: [
    'Role-based access',
    'Member approvals',
    'Secure invitations',
    'Workspace isolation',
  ],
};

export default function Security() {
  const { eyebrow, headline, description, features } = CONTENT;

  return (
    <section
      id="security"
      className="scroll-mt-16 bg-[#0a0a0a] py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 border border-white/8 bg-[#111111] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:p-16">
          <div className="max-w-2xl">
            <p className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">
              <span aria-hidden className="h-px w-8 bg-accent" />
              {eyebrow}
            </p>

            <h2 className="mt-8 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              {headline}
            </h2>

            <p className="mt-6 text-base leading-relaxed text-[#7a716a] sm:text-lg">
              {description}
            </p>
          </div>

          <ul className="grid w-full shrink-0 grid-cols-1 border border-white/10 list-none sm:grid-cols-2 lg:w-105">
            {features.map((feature, i) => (
              <li
                key={feature}
                className={`flex items-center gap-3 border-white/10 px-5 py-6 text-sm text-[#7a716a] ${
                  i < features.length - 1 ? 'border-b' : ''
                } ${i >= features.length - 2 ? 'sm:border-b-0' : ''} ${
                  i % 2 === 0 ? 'sm:border-r' : ''
                }`}
              >
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={16}
                  className="shrink-0 text-accent"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
