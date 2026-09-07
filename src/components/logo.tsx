import Link from 'next/link';

export default function Logo({ type = 'link' }: { type?: 'link' | 'text' }) {
  const content = (
    <>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white shadow-lg shadow-accent/30">
        W
      </div>
      <span className="text-[17px] font-bold tracking-tight text-white">
        Work<span className="text-accent">spora</span>
      </span>
    </>
  );

  const className = 'flex items-center gap-2.5 select-none';

  if (type === 'text') {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href="/" className={className}>
      {content}
    </Link>
  );
}
