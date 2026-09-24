import { getInitials } from '@/lib/utils';
import Image from 'next/image';

export default function UserAvatar({
  name,
  email,
  image,
  className,
}: {
  name?: string;
  email?: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name || email || 'User avatar'}
        width={28}
        height={28}
        className={`object-cover ${className ?? ''}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-accent text-[11px] font-bold text-white ${className ?? ''}`}
    >
      {getInitials(name, email)}
    </div>
  );
}
