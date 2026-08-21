import { OrganizationRole } from '@/lib/types';

const ROLE_STYLES = {
  OWNER: 'bg-accent/10 text-accent',
  ADMIN: 'bg-blue-500/10 text-blue-400',
  MEMBER: 'bg-white/8 text-gray-400',
};

const ROLE_LABELS = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
};

export default function RoleBadge({ role }: { role: OrganizationRole }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${ROLE_STYLES[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
