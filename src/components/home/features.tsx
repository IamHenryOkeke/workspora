interface Feature {
  title: string;
  description: string;
}

interface FeaturesContent {
  eyebrow: string;
  headline: [string, string];
  description: string;
  items: Feature[];
}

const CONTENT: FeaturesContent = {
  eyebrow: 'One system for momentum',
  headline: ['Less managing work.', 'More meaningful progress.'],
  description:
    'Everything your team needs to move from idea to outcome, without the clutter that slows you down.',
  items: [
    {
      title: 'Projects with clarity',
      description:
        'Plan initiatives, set milestones, and understand what needs attention at a glance.',
    },
    {
      title: 'Teams that stay aligned',
      description:
        'Keep decisions, ownership, and conversations connected to the work they affect.',
    },
    {
      title: 'Access you control',
      description:
        'Invite collaborators with role-based permissions and a thoughtful approval workflow.',
    },
    {
      title: 'Progress you can see',
      description:
        'Turn everyday updates into a real-time view of momentum, risk, and delivery.',
    },
    {
      title: 'Organizations, organized',
      description:
        'Move between companies and client workspaces without losing context or focus.',
    },
    {
      title: 'Built for deep work',
      description:
        'Fast navigation and a low-noise interface keep attention exactly where it belongs.',
    },
  ],
};

export default function Features() {
  const { eyebrow, headline, description, items } = CONTENT;

  return (
    <section
      id="features"
      className="scroll-smooth border-t border-white/[0.07] bg-[#0a0a0a] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </p>

        <h2 className="mt-8 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          {headline[0]}
          <br className="hidden sm:block" /> {headline[1]}
        </h2>

        <p className="mt-6 max-w-2xl text-base text-[#7a716a] sm:text-lg">
          {description}
        </p>

        <div className="mt-16 grid grid-cols-1 border-l border-t border-white/[0.07] sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.title}
              className="group flex min-h-80 flex-col border-b border-r border-white/[0.07] bg-[#0c0c0c] p-8 sm:p-12 lg:min-h-95"
            >
              <span className="font-mono text-xs text-accent/60">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="mt-auto">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-[#7a716a]">
                  {item.description}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="mt-12 block h-px w-6 bg-white/20 transition-all duration-300 group-hover:w-20 group-hover:bg-accent motion-reduce:transition-none"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
