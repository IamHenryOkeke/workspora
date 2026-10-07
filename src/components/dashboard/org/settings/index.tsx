'use client';

import { useSearchParams } from 'next/navigation';
import { useGetOrganization } from '@/hooks/use-get-organization';
import { usePageTitle } from '@/hooks/use-page-title';
import { useCanManageOrganization } from '@/hooks/use-can-manage-organization';
import AppTabs from '../../app-tabs';
import OrganizationTab from './organization-tab';

const TAB_KEY = 'active-tab';

export default function SettingsHome({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const { organization, isPending, isNotFound } = useGetOrganization(slug);
  const canManage = useCanManageOrganization();

  usePageTitle(organization ? `Settings | ${organization.name}` : 'Loading');

  const header = (
    <div className="mb-8 flex items-start justify-between gap-4">
      <h1 className="text-2xl font-medium text-white">Settings</h1>
    </div>
  );

  if (isPending) {
    return (
      <div>
        {header}
        <div className="mb-6 h-9 w-56 animate-pulse rounded bg-white/5" />
        <div className="h-72 max-w-2xl animate-pulse rounded-md bg-white/5" />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">
          This organisation doesn&apos;t exist or you no longer have access.
        </p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-medium text-red-400">
          Couldn&apos;t load settings
        </p>
      </div>
    );
  }

  const tabs = [
    ...(canManage ? [{ label: 'Organization', value: 'organization' }] : []),
    { label: 'Account', value: 'account' },
  ];

  const requestedTab = searchParams.get(TAB_KEY);
  const currentTabValue = tabs.some((tab) => tab.value === requestedTab)
    ? requestedTab
    : tabs[0].value;

  return (
    <div>
      {header}
      <AppTabs variant="line" urlKey={TAB_KEY} tabs={tabs} />

      {currentTabValue === 'organization' && canManage && (
        <OrganizationTab organization={organization} />
      )}
      {currentTabValue === 'account' && <div>Account</div>}
    </div>
  );
}
