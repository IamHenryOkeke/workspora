export type ApiResponse<T = unknown> = {
  message: string;
  data?: T;
  user?: User;
  accessToken?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
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
  totalProjects: number;
  membersByRole: StatCount[];
  membersByStatus: StatCount[];
  projectsByStatus: StatCount[];
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

export type PaginationType = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
