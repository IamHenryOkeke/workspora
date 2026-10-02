'use client';

import UserAvatar from '@/components/user-avatar';
import { DataTableFeatures } from '@/lib/data-table-features';
import { Member } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';
import RoleBadge from '../../role-badge';
import MemberStatus from '../../member-status';
import MemberActions from './member-actions';
import ColumnHeader from '../../column-header';

const columnHelper = createColumnHelper<DataTableFeatures, Member>();

export const memberColumns = columnHelper.columns([
  columnHelper.accessor('user', {
    id: 'member',
    header: () => <ColumnHeader title="Member" />,
    cell: (row) => {
      const value = row.getValue();
      const { fullName, email, avatar } = value;
      return (
        <div className="flex items-center gap-3">
          <UserAvatar
            name={fullName}
            email={email}
            image={avatar}
            className="h-7 w-7"
          />
          <span className="text-sm text-white">{fullName}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('user', {
    id: 'email',
    header: () => <ColumnHeader title="Email" />,
    cell: (row) => {
      const value = row.getValue();
      const { email } = value;
      return <span className="text-sm text-white/50">{email}</span>;
    },
  }),
  columnHelper.accessor('role', {
    id: 'role',
    header: () => <ColumnHeader title="Role" />,
    cell: (row) => {
      const value = row.getValue();
      return <RoleBadge role={value} />;
    },
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: () => <ColumnHeader title="Status" />,
    cell: (row) => {
      const value = row.getValue();
      return <MemberStatus status={value} />;
    },
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      return <MemberActions member={row.original} />;
    },
  }),
]);
