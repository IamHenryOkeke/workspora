import { ApiResponse, Organization, PaginationType } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useOrganizationStore } from '@/stores/org-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

type OrganizationsResponse = {
  organizations: Organization[];
  pagination: PaginationType;
};

const fetchOrganizations = async (
  page?: number,
  query?: string,
): Promise<ApiResponse<OrganizationsResponse>> => {
  const { data } = await OrganizationService.getOrganizations({
    ...(page && { page }),
    ...(query && { searchTerm: query }),
  });
  return data;
};

export function useGetAllOrganizations(page?: number, query?: string) {
  const setOrganizations = useOrganizationStore(
    (state) => state.setOrganizations,
  );
  const { isPending, error, data } = useQuery({
    queryKey: [
      'organizations',
      {
        page: page || 1,
        query: query || '',
      },
    ],
    queryFn: () => fetchOrganizations(page, query),
  });

  const organizations = data?.data?.organizations || [];

  useEffect(() => {
    if (data?.data?.organizations) {
      setOrganizations(data.data.organizations);
    }
  }, [data, setOrganizations]);

  return { isPending, organizations, error };
}
