'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useParams, usePathname } from 'next/navigation';
import { useOrganizationStore } from '@/stores/org-store';
import { Button } from '@/components/ui/button';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  home: {
    title: 'Dashboard',
    subtitle: 'A quick overview of what is happening in your organization',
  },
  projects: {
    title: 'Projects',
    subtitle: 'Create, track and manage your projects',
  },
  members: {
    title: 'Members',
    subtitle: 'See who is part of your organization and what they can do',
  },
  invitations: {
    title: 'Invitations',
    subtitle: 'Invite new people and manage pending invites',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Update your organization details and preferences',
  },
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { slug } = useParams<{ slug: string }>();
  const { organizations } = useOrganizationStore();
  const { isMobile, setOpenMobile, toggleSidebar } = useSidebar();

  const currentOrganization = organizations.find((org) => org.slug === slug);
  const segment =
    pathname.split(`/dashboard/org/${slug}/`)[1]?.split('/')[0] ?? 'home';
  const meta = pageMeta[segment] ?? pageMeta.home;

  const handleOpen = () => {
    if (isMobile) setOpenMobile(true);
    else toggleSidebar();
  };

  return (
    <header className="sticky top-0 z-10 flex min-h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-background/80 px-4 py-3 backdrop-blur md:px-10">
      <Button
        size="icon"
        onClick={handleOpen}
        aria-label="Open menu"
        className="relative z-20 flex size-9 shrink-0 items-center justify-center rounded-lg text-white/80 hover:bg-gray-700/50 hover:text-white md:hidden"
      >
        <HugeiconsIcon icon={Menu01Icon} size={20} />
      </Button>
      <div className="min-w-0">
        {currentOrganization && (
          <p className="truncate text-xs text-white/50">
            {currentOrganization.name}
          </p>
        )}
        <h1 className="truncate text-lg font-semibold leading-tight text-white">
          {meta.title}
        </h1>
        <p className="hidden truncate text-sm text-white/60 sm:block">
          {meta.subtitle}
        </p>
      </div>
    </header>
  );
}
