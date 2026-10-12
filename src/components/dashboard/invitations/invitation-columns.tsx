'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { DataTableFeatures } from '@/lib/data-table-features';
import { InvitationStatusType, ReceivedInvitation } from '@/lib/types';
import { formatDate, getEffectiveStatus } from '@/lib/utils';
import RoleBadge from '../role-badge';
import ColumnHeader from '../column-header';
import OrganizationLogo from '../organization-logo';
import { STATUS_STYLES } from '../org/invitations/invitation-columns';
import InvitationActions from './invitation-actions';

const columnHelper = createColumnHelper<
  DataTableFeatures,
  ReceivedInvitation
>();

function StatusBadge({ status }: { status: InvitationStatusType }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export const invitationColumns = columnHelper.columns([
  columnHelper.accessor((invitation) => invitation.organization.name, {
    id: 'organization',
    header: () => <ColumnHeader title="Organization" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <OrganizationLogo
          name={row.original.organization.name}
          logo={row.original.organization.logo}
          size={32}
        />
        <div className="min-w-0">
          <p className="truncate text-sm text-white">
            {row.original.organization.name}
          </p>
          <p className="text-xs text-white/20">
            Received {formatDate(row.original.createdAt)}
          </p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('role', {
    id: 'role',
    header: () => <ColumnHeader title="Role" />,
    cell: (row) => <RoleBadge role={row.getValue()} />,
  }),
  columnHelper.accessor('invitedBy', {
    id: 'invitedBy',
    header: () => <ColumnHeader title="Invited by" />,
    cell: (row) => (
      <span className="text-sm text-white/50">
        {row.getValue()?.fullName ?? '—'}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: () => <ColumnHeader title="Status" />,
    // Effective status: a PENDING invite past its expiry shows as Expired
    cell: ({ row }) => (
      <StatusBadge status={getEffectiveStatus(row.original)} />
    ),
  }),
  columnHelper.accessor('expiresAt', {
    id: 'expiresAt',
    header: () => <ColumnHeader title="Expires" />,
    cell: (row) => (
      <span className="text-sm text-white/50">
        {formatDate(row.getValue())}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => <InvitationActions invitation={row.original} />,
  }),
]);
