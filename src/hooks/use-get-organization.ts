import { ApiResponse, Organization } from '@/lib/types';
import { OrganizationService } from '@/services/organization';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type OrganizationDetail = {
  organization: Organization;
};

const fetchOrganization = async (
  slug: string,
): Promise<ApiResponse<OrganizationDetail>> => {
  const { data } = await OrganizationService.getOrganizationBySlug(slug);
  return data;
};

export function useGetOrganization(slug: string) {
  const router = useRouter();

  const {
    isPending,
    error,
    data: organizationData,
  } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => fetchOrganization(slug),
    retry: (failureCount, err) => {
      if (err instanceof AxiosError && err.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const organization = organizationData?.data?.organization;
  const isNotFound =
    error instanceof AxiosError && error.response?.status === 404;

  useEffect(() => {
    if (isNotFound) {
      router.replace('/dashboard/org');
    }
  }, [isNotFound, router]);

  return { isPending, organization, error, isNotFound };
}
