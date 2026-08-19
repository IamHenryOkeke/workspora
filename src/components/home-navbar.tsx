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
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Modal } from './dashboard/modal';
import toast from 'react-hot-toast';

function getInitials(name?: string, email?: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`
        : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'WS';
}

function UserAvatar({
  name,
  email,
  image,
  className,
}: {
  name?: string;
  email?: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name || email || 'User avatar'}
        width={28}
        height={28}
        className={`rounded-full object-cover ${className ?? ''}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white ${className ?? ''}`}
    >
      {getInitials(name, email)}
    </div>
  );
}

export default function HomeNavbar() {
  const { user, isHydrated, clearAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    setDropdownOpen(false);
  };

  const displayName = user?.name || user?.email?.split('@')[0];

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-gray-950/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white shadow-lg shadow-accent/30">
            W
          </div>
          <span className="text-[17px] font-bold tracking-tight text-white">
            Work<span className="text-accent">spora</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-7 list-none">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          {!isHydrated ? (
            <span className="h-2 w-2 rounded-full bg-gray-600 animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/dashboard/org"
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                <HugeiconsIcon icon={GridTableIcon} />
                Dashboard
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  <UserAvatar
                    name={user.name}
                    email={user.email}
                    image={user.avatar}
                    className="h-7 w-7"
                  />
                  <span className="text-xs text-gray-300">{displayName}</span>
                  <HugeiconsIcon icon={ArrowDown01Icon} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/8 bg-gray-900 shadow-2xl shadow-black/50">
                    <div className="border-b border-white/[0.07] px-3.5 py-2.5">
                      <p className="truncate text-sm font-medium text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <HugeiconsIcon icon={User02Icon} /> Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <HugeiconsIcon icon={Settings01Icon} /> Settings
                      </Link>
                    </div>
                    <div className="border-t border-white/[0.07] py-1">
                      <Modal
                        trigger={
                          <button className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300">
                            <HugeiconsIcon icon={Logout01Icon} /> Sign out
                          </button>
                        }
                        title="Sign out"
                        description="Are you sure you want to sign out? You will be redirected to the login page."
                        confirmText="Yes, sign out"
                        onConfirm={handleSignOut}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:bg-accent/80 hover:-translate-y-px active:translate-y-0"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="flex md:hidden items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <HugeiconsIcon icon={Cancel01Icon} />
          ) : (
            <HugeiconsIcon icon={Menu01Icon} />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/[0.07] bg-gray-950 px-4 pb-5 pt-3 md:hidden">
          <ul className="mb-4 flex flex-col gap-1 list-none">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {isHydrated &&
            (user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/3 p-3">
                  <UserAvatar
                    name={user.name}
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
                  className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white"
                >
                  <HugeiconsIcon icon={GridTableIcon} /> Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <HugeiconsIcon icon={User02Icon} /> Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <HugeiconsIcon icon={Settings01Icon} /> Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <HugeiconsIcon icon={Logout01Icon} /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="rounded-lg border border-white/10 py-2.5 text-center text-sm font-medium text-gray-300 transition hover:bg-white/5"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="rounded-lg bg-accent py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign up
                </Link>
              </div>
            ))}
        </div>
      )}
    </header>
  );
}
