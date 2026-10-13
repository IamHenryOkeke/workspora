import Link from 'next/link';
import Logo from '../logo';

interface FooterLink {
  label: string;
  href: string;
}

const FOOTER_LINKS: FooterLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 sm:px-6 md:flex-row md:justify-between lg:px-8">
        <Logo />

        <p className="text-center text-sm text-[#7a716a]">
          &copy; {new Date().getFullYear()} Workspora. Built for work that
          matters.
        </p>

        <ul className="flex items-center gap-6 list-none">
          {FOOTER_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm text-[#7a716a] transition-colors hover:text-white"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
