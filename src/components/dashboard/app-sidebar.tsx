'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
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
  const { isMobile, setOpenMobile, state, toggleSidebar } = useSidebar();

  const currentOrganization = organizations.find((org) => org.slug === slug);

  const filteredOrgs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return organizations;
    return organizations.filter((org) => org.name.toLowerCase().includes(term));
  }, [organizations, searchTerm]);

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={currentOrganization?.name || 'Select organization'}
                  className="text-white hover:bg-gray-700/50 hover:text-white"
                >
                  <OrganizationLogo
                    name={currentOrganization?.name || 'Select organization'}
                    logo={currentOrganization?.logo}
                    size={32}
                  />
                  <span className="flex-1 truncate font-medium">
                    {!hasFetched
                      ? 'Loading...'
                      : currentOrganization?.name || 'Select organization'}
                  </span>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? 'bottom' : 'right'}
                align="start"
                className="w-64 pt-1.5 space-y-2 border border-white/10"
              >
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
                      onClick={closeMobile}
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
                    onClick={closeMobile}
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

      <SidebarContent className="pt-6 px-2 bg-background/50 border-y border-white/10">
        <SidebarMenu className="gap-2">
          {getNavLinks(role !== 'MEMBER').map((link) => {
            const href = `/dashboard/org/${slug}/${link.segment}`;
            return (
              <SidebarMenuItem key={link.segment}>
                <SidebarLinkItem
                  href={href}
                  label={link.label}
                  icon={link.icon}
                  onNavigate={closeMobile}
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-2 bg-background/50">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarLinkItem
              href={`/dashboard/org/${slug}/settings`}
              label="Settings"
              icon={Settings02Icon}
              onNavigate={closeMobile}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLinkItem
              href="/dashboard/org"
              label="Back to Orgs"
              icon={ArrowLeft01Icon}
              exact
              onNavigate={closeMobile}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserMenu role={currentOrganization?.role} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {!isMobile && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="absolute -right-3 top-18 z-30 flex size-6 items-center justify-center rounded-full border border-white/10 bg-background text-white/70 shadow-sm transition-colors hover:bg-gray-700 hover:text-white"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={14}
            className={`transition-transform ${
              state === 'collapsed' ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}
      <SidebarRail />
    </Sidebar>
  );
}

export const SidebarLinkItem = ({
  href,
  label,
  icon,
  exact = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
  exact?: boolean;
  onNavigate?: () => void;
}) => {
  const pathName = usePathname();
  const isActive = exact
    ? pathName === href
    : pathName === href || pathName.startsWith(`${href}/`);

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={label}
      className="h-10 text-white hover:bg-gray-700/50 hover:text-white data-[active=true]:border-l-2 data-[active=true]:border-accent data-[active=true]:bg-accent/20 data-[active=true]:text-accent"
    >
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
      >
        <HugeiconsIcon icon={icon} />
        <span>{label}</span>
      </Link>
    </SidebarMenuButton>
  );
};
