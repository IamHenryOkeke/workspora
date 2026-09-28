import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTabs } from '@/hooks/use-tabs';

type AppTabsProp = {
  variant?: 'line' | 'default' | null | undefined;
  urlKey?: string;
  tabs: {
    value: string;
    label: string;
  }[];
};

export default function AppTabs({
  urlKey = 'status',
  tabs,
  variant,
}: AppTabsProp) {
  const { currentValue, handleValueChange } = useTabs(urlKey, tabs);

  if (variant === 'line')
    return (
      <div className="mb-6 flex items-center gap-6 border-b border-white/8">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleValueChange(value)}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              currentValue === value
                ? 'border-amber-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );

  return (
    <Tabs value={currentValue} onValueChange={handleValueChange}>
      <TabsList>
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
