'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DashboardSquare02Icon,
  ChartNoAxesGanttIcon,
  UsersIcon,
  MailAccount01Icon,
  Settings02Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  CheckIcon,
  PlusIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import OrganizationLogo from './organization-logo';
import { useOrganizationStore } from '@/stores/org-store';
import { useMemo, useState } from 'react';
import UserMenu from './user-menu';
import Search from './search';
import { useCurrentOrganizationRole } from '@/hooks/use-current-organization-role';

const navLinks = [
  { label: 'Dashboard', segment: 'home', icon: DashboardSquare02Icon },
  { label: 'Projects', segment: 'projects', icon: ChartNoAxesGanttIcon },
  { label: 'Members', segment: 'members', icon: UsersIcon },
  { label: 'Invitations', segment: 'invitations', icon: MailAccount01Icon },
];

const getNavLinks = (isAdmin: boolean) => {
  if (isAdmin) return navLinks;
  return navLinks.filter((link) => link.segment !== 'invitations');
};

export function AppSidebar() {
  const { role } = useCurrentOrganizationRole();
  const [searchTerm, setSearchTerm] = useState('');
  const { slug } = useParams<{ slug: string }>();
  const { organizations, hasFetched } = useOrganizationStore();

  const currentOrganization = organizations.find((org) => org.slug === slug);

  const filteredOrgs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return organizations;
    return organizations.filter((org) => org.name.toLowerCase().includes(term));
  }, [organizations, searchTerm]);
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-gray-700/50"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <OrganizationLogo
                      name={currentOrganization?.name || 'Select organization'}
                      logo={currentOrganization?.logo}
                      size={34}
                    />
                    <span className="truncate">
                      {!hasFetched
                        ? 'Loading...'
                        : currentOrganization?.name || 'Select organization'}
                    </span>
                  </div>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 pt-1.5 space-y-2 border border-white/10">
                <div
                  onKeyDown={(e) => {
                    if (e.key !== 'Escape' && e.key !== 'ArrowDown')
                      e.stopPropagation();
                  }}
                >
                  <Search
                    placeholder="Search organizations..."
                    handleSearch={setSearchTerm}
                  />
                </div>
                {filteredOrgs.map((org) => (
                  <DropdownMenuItem key={org.id} asChild>
                    <Link
                      href={`/dashboard/org/${org.slug}/home`}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-white"
                    >
                      <div
                        className={`flex min-w-0 items-center gap-2 ${
                          currentOrganization?.id === org.id
                            ? 'text-accent'
                            : ''
                        }`}
                      >
                        <OrganizationLogo
                          name={org.name}
                          logo={org.logo}
                          size={24}
                        />
                        <span className="truncate">{org.name}</span>
                      </div>
                      {currentOrganization?.id === org.id && (
                        <HugeiconsIcon
                          icon={CheckIcon}
                          size={16}
                          strokeWidth={3}
                          className="shrink-0 text-accent"
                        />
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="border-white/10" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/create-org"
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-white"
                  >
                    <HugeiconsIcon icon={PlusIcon} size={16} />
                    <span>New Organization</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-10 px-2 bg-background/50 border-y border-white/10">
        <SidebarMenu className="space-y-4">
          {getNavLinks(role !== 'MEMBER').map((link) => {
            const href = `/dashboard/org/${slug}/${link.segment}`;
            return (
              <SidebarMenuItem key={link.segment}>
                <SidebarLinkItem
                  href={href}
                  label={link.label}
                  icon={link.icon}
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-2 bg-background/50">
        <SidebarMenu className="space-y-3">
          <SidebarMenuItem>
            <SidebarLinkItem
              href={`/dashboard/org/${slug}/settings`}
              label="Settings"
              icon={Settings02Icon}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLinkItem
              href="/dashboard/org"
              label="Back to Orgs"
              icon={ArrowLeft01Icon}
              exact
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserMenu role={currentOrganization?.role} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export const SidebarLinkItem = ({
  href,
  label,
  icon,
  exact = false,
}: {
  href: string;
  label: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
  exact?: boolean;
}) => {
  const pathName = usePathname();
  const isActive = exact
    ? pathName === href
    : pathName === href || pathName.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
        isActive
          ? 'text-accent border-l-2 border-accent bg-accent/20'
          : 'hover:bg-gray-700/50 text-white'
      }`}
    >
      <HugeiconsIcon icon={icon} />
      <span>{label}</span>
    </Link>
  );
};
