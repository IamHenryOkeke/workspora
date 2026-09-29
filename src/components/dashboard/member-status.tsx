import { MemberStatusType } from '@/lib/types';

export const STATUS_LABEL: Record<MemberStatusType, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  INVITED: 'Invited',
  SUSPENDED: 'Suspended',
  REMOVED: 'Removed',
};

export const STATUS_BADGE: Record<MemberStatusType, string> = {
  ACTIVE: 'bg-accent/10 text-accent border border-accent/50',
  PENDING: 'bg-accent/10 text-accent border border-accent/20',
  SUSPENDED: 'bg-red-600/40 border border-red/50 text-red-400',
  INVITED: 'bg-white/10 text-gray-400 border border-white/20',
  REMOVED: 'bg-red-600/40 border border-red/50 text-red-400',
};

export default function MemberStatus({ status }: { status: MemberStatusType }) {
  return (
    <span
      className={`shrink-0 px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
