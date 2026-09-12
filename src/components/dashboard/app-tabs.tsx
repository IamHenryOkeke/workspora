import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type AppTabsProp = {
  urlKey?: string;
  tabs: {
    value: string;
    label: string;
  }[];
};

export default function AppTabs({ urlKey = 'status', tabs }: AppTabsProp) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentValue = searchParams.get(urlKey) || tabs[0].value;

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(urlKey, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs value={currentValue} onValueChange={handleValueChange}>
      <TabsList className="bg-blue">
        {tabs.map((tab) => (
          <TabsTrigger
            className="data-active:bg-accent/10 data-active:text-accent data-active:border data-active:border-accent/50 p-4 data-active:hover:text-accent"
            key={tab.value}
            value={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
