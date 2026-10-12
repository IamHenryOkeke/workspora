import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useTogglePasswordVisibity } from '@/hooks/use-toggle-password-visibility';
import { EyeIcon, EyeOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function PasswordInput({ ...props }: React.ComponentProps<'input'>) {
  const { showPassword, togglePasswordVisibity } = useTogglePasswordVisibity();
  return (
    <InputGroup>
      <InputGroupInput
        type={showPassword ? 'text' : 'password'}
        data-slot="input"
        placeholder="Enter password"
        {...props}
      />
      <InputGroupAddon
        onClick={togglePasswordVisibity}
        align="inline-end"
        className="cursor-pointer"
      >
        {showPassword ? (
          <HugeiconsIcon icon={EyeIcon} size={18} />
        ) : (
          <HugeiconsIcon icon={EyeOffIcon} size={18} />
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
