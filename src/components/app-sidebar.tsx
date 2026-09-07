'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/auth-store';
import { useOrganizationStore } from '@/stores/org-store';
import {
  DashboardSquare02Icon,
  ChartNoAxesGanttIcon,
  UsersIcon,
  MailAccount01Icon,
  Settings02Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  CheckIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { UserAvatar } from './home-navbar';
import { ROLE_LABELS } from './dashboard/role-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import OrganizationOrUserLogo from './dashboard/organization-user-logo';
import { Logout } from './logout';

const navLinks = [
  { label: 'Dashboard', segment: 'home', icon: DashboardSquare02Icon },
  { label: 'Projects', segment: 'projects', icon: ChartNoAxesGanttIcon },
  { label: 'Members', segment: 'members', icon: UsersIcon },
  { label: 'Invitations', segment: 'invitations', icon: MailAccount01Icon },
];

export function AppSidebar() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  const { organizations, fetchOrganizations } = useOrganizationStore();

  useEffect(() => {
    fetchOrganizations();
  }, []);
  const currentOrganization = organizations.find((org) => org.slug === slug);
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuItem className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-gray-700/50">
                  <div className="flex items-center gap-2">
                    <OrganizationOrUserLogo
                      name={currentOrganization?.name || 'Select organization'}
                      logo={currentOrganization?.logo}
                      size={34}
                    />
                    <span>
                      {currentOrganization?.name || 'Select organization'}
                    </span>
                  </div>
                  <HugeiconsIcon icon={ArrowDown01Icon} />
                </SidebarMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border border-white/10 space-y-1">
                <DropdownMenuItem className="flex flex-col gap-1.5 border-b border-white/10 px-3 py-2.5">
                  {organizations.map((org) => (
                    <Link
                      key={org.id}
                      href={`/dashboard/org/${org.slug}/home`}
                      className="flex w-full items-center justify-between gap-2 rounded-lg text-sm font-medium text-white"
                    >
                      <div
                        className={`flex items-center gap-2 ${currentOrganization?.id === org.id ? 'text-accent' : ''}`}
                      >
                        <OrganizationOrUserLogo
                          name={org.name}
                          logo={org.logo}
                          size={24}
                        />
                        <span>{org.name}</span>
                      </div>
                      {currentOrganization?.id === org.id && (
                        <HugeiconsIcon
                          icon={CheckIcon}
                          size={40}
                          strokeWidth={3}
                          className="text-accent"
                        />
                      )}
                    </Link>
                  ))}
                </DropdownMenuItem>
                <SidebarLinkItem
                  href="/dashboard/create-org"
                  label="New Organization"
                  icon={Settings02Icon}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-10 px-2 bg-background/50 border-y border-white/10">
        <SidebarMenu className="space-y-4">
          {navLinks.map((link) => {
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
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter className="px-2 bg-background/50">
        <SidebarMenu className="space-y-3">
          <SidebarMenuItem>
            <SidebarLinkItem
              href="settings"
              label="Settings"
              icon={Settings02Icon}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLinkItem
              href="/dashboard/org"
              label="Back to Orgs"
              icon={ArrowLeft01Icon}
            />
          </SidebarMenuItem>
          <SidebarMenuItem className="px-3 py-2.5">
            <div className="flex items-center gap-2">
              <UserAvatar
                name={user?.fullName}
                email={user?.email}
                image={user?.avatar}
                className="h-7 w-7"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-300">
                  {user?.fullName || user?.email?.split('@')[0]}
                </span>
                <span className="text-xs text-gray-500">
                  {
                    ROLE_LABELS[
                      (currentOrganization?.role as keyof typeof ROLE_LABELS) ||
                        'MEMBER'
                    ]
                  }
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Logout />
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
}: {
  href: string;
  label: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
}) => {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white ${
        isActive
          ? 'text-accent border-l-2 border-accent bg-accent/20'
          : 'hover:bg-gray-700/50'
      }`}
    >
      <HugeiconsIcon icon={icon} />
      <span>{label}</span>
    </Link>
  );
};
