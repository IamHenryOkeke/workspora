'use client';

import {
  ArrowDown01Icon,
  Cancel01Icon,
  GridTableIcon,
  Logout01Icon,
  Menu01Icon,
  Settings01Icon,
  User02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { ConfirmModal } from './dashboard/modal';
import { toast } from 'sonner';
import UserAvatar from './user-avatar';
import Logo from './logo';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Security', href: '/#security' },
];

export default function HomeNavbar() {
  const { user, isHydrated, clearAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('[role="dialog"]')) return;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleSignOut = () => {
    clearAuth();
    toast.success('Logged out successfully');
    setSignOutModalOpen(false);
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const openSignOutModal = () => {
    setDropdownOpen(false);
    setSignOutModalOpen(true);
  };

  const displayName = user?.fullName || user?.email?.split('@')[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden md:flex items-center gap-10 list-none">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-5">
          {!isHydrated ? (
            <span className="h-2 w-2 rounded-full bg-gray-600 animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/dashboard/org"
                className="flex items-center gap-2 bg-accent px-5 py-2 text-sm font-semibold text-gray-950 transition hover:bg-accent/90 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <HugeiconsIcon icon={GridTableIcon} size={16} />
                Dashboard
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  <UserAvatar
                    name={user.fullName}
                    email={user.email}
                    image={user.avatar}
                    className="h-7 w-7"
                  />
                  <span className="text-xs text-gray-300">{displayName}</span>
                  <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                </button>

                {dropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-52 overflow-hidden border border-white/10 bg-[#111111] shadow-2xl shadow-black/50"
                  >
                    <div className="border-b border-white/[0.07] px-3.5 py-2.5">
                      <p className="truncate text-sm font-medium text-white">
                        {user.fullName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        role="menuitem"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <HugeiconsIcon icon={User02Icon} size={16} /> Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        role="menuitem"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <HugeiconsIcon icon={Settings01Icon} size={16} />{' '}
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-white/[0.07] py-1">
                      <button
                        onClick={openSignOutModal}
                        role="menuitem"
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        <HugeiconsIcon icon={Logout01Icon} size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="bg-accent px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Start for free
              </Link>
            </>
          )}
        </div>

        <button
          className="flex md:hidden items-center justify-center p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <HugeiconsIcon icon={Cancel01Icon} />
          ) : (
            <HugeiconsIcon icon={Menu01Icon} />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/[0.07] bg-[#0a0a0a] px-4 pb-5 pt-3 md:hidden">
          <ul className="mb-4 flex flex-col gap-1 list-none">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {isHydrated &&
            (user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 border border-white/10 bg-white/3 p-3">
                  <UserAvatar
                    name={user.fullName}
                    email={user.email}
                    image={user.avatar}
                    className="h-8 w-8 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/org"
                  className="flex items-center justify-center gap-2 bg-accent py-2.5 text-sm font-semibold text-gray-950"
                >
                  <HugeiconsIcon icon={GridTableIcon} size={16} /> Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <HugeiconsIcon icon={User02Icon} size={16} /> Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <HugeiconsIcon icon={Settings01Icon} size={16} /> Settings
                </Link>
                <button
                  onClick={openSignOutModal}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <HugeiconsIcon icon={Logout01Icon} size={16} /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="border border-white/10 py-2.5 text-center text-sm font-medium text-gray-300 transition hover:bg-white/5"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="bg-accent py-2.5 text-center text-sm font-semibold text-gray-950"
                >
                  Start for free
                </Link>
              </div>
            ))}
        </div>
      )}

      <ConfirmModal
        open={signOutModalOpen}
        onOpenChange={setSignOutModalOpen}
        title="Sign out"
        description="Are you sure you want to sign out? You will be redirected to the login page."
        confirmLabel="Yes, sign out"
        variant="destructive"
        onConfirm={handleSignOut}
      />
    </header>
  );
}
