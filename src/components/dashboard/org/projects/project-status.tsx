import { STATUS_BADGE, STATUS_LABEL } from '../project-status';
import type { ProjectStatus } from '@/lib/types';

export default function ProjectStatus({ status }: { status: ProjectStatus }) {
  return (
    <span className={`px-2.5 py-0.5 text-[10px] ${STATUS_BADGE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
