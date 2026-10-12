import { useDebouncedCallback } from 'use-debounce';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

type SearchProps = {
  handleSearch: (searchTerm: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
};

export default function Search({
  className,
  placeholder,
  defaultValue,
  handleSearch,
}: SearchProps) {
  const onSearch = useDebouncedCallback((term: string) => {
    handleSearch(term);
  }, 700);

  return (
    <div className="w-full max-w-xs">
      <InputGroup
        className={className ? ` ${className}` : 'h-20 w-full lg:h-11'}
      >
        <InputGroupInput
          onChange={(e) => onSearch(e.target.value)}
          data-slot="input"
          defaultValue={defaultValue}
          placeholder={placeholder || 'Search...'}
        />
        <InputGroupAddon align="inline-start">
          <HugeiconsIcon icon={Search01Icon} size={18} />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
