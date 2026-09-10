import { Project } from '@/lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Clock01Icon,
  PlayIcon,
  CheckmarkCircle01Icon,
  ArchiveIcon,
} from '@hugeicons/core-free-icons';

export const STATUS_ICON = {
  PENDING: { icon: Clock01Icon, className: 'bg-gray-500/10 text-gray-400' },
  ACTIVE: { icon: PlayIcon, className: 'bg-accent/10 text-accent' },
  COMPLETED: {
    icon: CheckmarkCircle01Icon,
    className: 'bg-green-500/10 text-green-400',
  },
  ARCHIVED: {
    icon: ArchiveIcon,
    className: 'bg-gray-500/10 text-gray-500',
  },
} satisfies Record<
  Project['status'],
  {
    icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
    className: string;
  }
>;

export const STATUS_LABEL: Record<Project['status'], string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};
