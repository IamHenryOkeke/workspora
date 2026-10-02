'use client';

import { DataTableFeatures } from '@/lib/data-table-features';
import { Invitation, InvitationStatusType } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';
import RoleBadge from '../../role-badge';
import { formatDate } from '@/lib/utils';
import ColumnHeader from '../../column-header';
import { useAuthStore } from '@/stores/auth-store';

const columnHelper = createColumnHelper<DataTableFeatures, Invitation>();

export const STATUS_STYLES: Record<InvitationStatusType, string> = {
  PENDING: 'bg-accent/10 text-accent',
  ACCEPTED: 'bg-green-500/10 text-green-400',
  DECLINED: 'bg-red-500/10 text-red-400',
  EXPIRED: 'bg-white/5 text-white/40',
  REVOKED: 'bg-white/5 text-white/40',
};

function InvitationStatus({ status }: { status: InvitationStatusType }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export const invitationColumns = columnHelper.columns([
  columnHelper.accessor('email', {
    id: 'email',
    header: () => <ColumnHeader title="Email" />,
    cell: ({ row }) => (
      <div className="">
        <p className="text-sm text-white">{row.original.email}</p>
        <p className="text-xs text-white/20">
          Sent {formatDate(row.original.createdAt)}
        </p>
      </div>
    ),
  }),
  columnHelper.accessor('role', {
    id: 'role',
    header: () => <ColumnHeader title="Role" />,
    cell: (row) => <RoleBadge role={row.getValue()} />,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: () => <ColumnHeader title="Status" />,
    cell: (row) => <InvitationStatus status={row.getValue()} />,
  }),
  columnHelper.accessor('invitedBy', {
    id: 'invitedBy',
    header: () => <ColumnHeader title="Invited by" />,
    cell: (row) => {
      const { user } = useAuthStore();
      return (
        <span className="text-sm text-white/50">
          {row.getValue()?.fullName ?? '—'}
          {row.getValue().id === user?.id && ' (You)'}
        </span>
      );
    },
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
]);
