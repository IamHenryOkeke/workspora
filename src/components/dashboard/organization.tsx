'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Organization {
  id: string | number;
  name: string;
}

const fetchOrganisations = async (): Promise<Organization[]> => {
  const res = await axios.get('/api/dashboard/organisations');
  return res.data.data.organisations;
};

export default function Organizations() {
  const router = useRouter();
  const { isPending, error, data } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganisations,
  });

  if (isPending) return <p className="text-gray-500">Loading...</p>;
  if (error)
    return (
      <p className="text-red-500">An error has occurred: {error.message}</p>
    );

  if (!data || data.length === 0) {
    router.push('/dashboard/create-org');
    return;
  }

  return (
    <div>
      <ul className="space-y-2">
        {data?.map((org) => (
          <li
            key={org.id}
            className="p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <span className="font-medium">{org.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
