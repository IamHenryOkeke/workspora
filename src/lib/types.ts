export type ApiResponse<T = unknown> = {
  message: string;
  data?: T;
  user?: User;
  accessToken?: string;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
};

export type OrganizationRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  ownerId: string;
  role: OrganizationRole;
  createdAt: string;
};

export type StatCount = {
  role?: string;
  status?: string;
  _count: number;
};

export type OrganizationStats = {
  totalMembers: number;
  activeMembers: number;
  totalProjects: number;
  activeProjects: number;
  pendingInvitations: number;
  membersByRole: StatCount[];
  membersByStatus: StatCount[];
  projectsByStatus: StatCount[];
};

export type OrganizationActivity = {
  type: 'member_joined' | 'invitation_sent' | 'project_created';
  id: string;
  timestamp: string;
  text: string;
  meta?: Record<string, unknown>;
};

export type Member = {
  id: string;
  role: OrganizationRole;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  organizationId: string;
  creatorId: string | null;
  creator: {
    id: string;
    fullName: string;
    avatar: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginationType = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
