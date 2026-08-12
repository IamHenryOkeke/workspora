import { useState } from 'react';

export function useTogglePasswordVisibity() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibity = () => {
    setShowPassword((prev) => !prev);
  };

  return { showPassword, togglePasswordVisibity };
}
