import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useTabs(
  urlKey: string,
  tabs: { value: string; label: string }[],
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentValue = searchParams.get(urlKey) || tabs[0].value;

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(urlKey, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return { currentValue, handleValueChange };
}
