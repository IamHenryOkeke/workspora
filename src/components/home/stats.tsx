interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: '10k+', label: 'Projects shipped' },
  { value: '38%', label: 'Less status chasing' },
  { value: '99.9%', label: 'Platform uptime' },
  { value: '24/7', label: 'Work stays in sync' },
];

export default function Stats() {
  return (
    <section
      aria-label="Workspora in numbers"
      className="border-y border-white/[0.07] bg-[#0a0a0a]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-y-10 py-12 lg:grid-cols-4 lg:py-14">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <dd className="order-1 text-2xl font-semibold tracking-tight text-accent sm:text-3xl">
                {value}
              </dd>
              <dt className="order-2 mt-3 text-[11px] uppercase tracking-[0.2em] text-[#7a716a] sm:text-xs">
                {label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
