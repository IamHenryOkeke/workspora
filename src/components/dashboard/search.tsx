'use client';

import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
      params.delete('page');
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative w-full max-w-xs">
      <HugeiconsIcon
        icon={Search01Icon}
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <Input
        onChange={(e) => {
          handleSearch(e.target.value.trim());
        }}
        defaultValue={searchParams.get('query')?.toString()}
        placeholder="Search organizations..."
        className="h-10 w-full pl-9 pr-3 lg:h-11"
      />
    </div>
  );
}
