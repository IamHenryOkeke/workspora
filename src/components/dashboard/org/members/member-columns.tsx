'use client';

import UserAvatar from '@/components/user-avatar';
import { DataTableFeatures } from '@/lib/data-table-features';
import { Member } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';
import RoleBadge from '../../role-badge';
import MemberStatus from '../../member-status';
import { Button } from '@/components/ui/button';

const columnHelper = createColumnHelper<DataTableFeatures, Member>();

function ColumnHeader({ title }: { title: string }) {
  return <div className="text-white/50">{title}</div>;
}

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
    header: () => <ColumnHeader title="Actions" />,
    cell: ({ row }) => {
      const memmerId = row.original.id;
      console.log(memmerId);
      return (
        <div className="flex gap-1.5 items-center">
          <Button>Edit</Button>
          <Button>Remove</Button>
        </div>
      );
    },
  }),
]);
