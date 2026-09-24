import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { Building03Icon } from '@hugeicons/core-free-icons';

type OrganizationLogoPropType = {
  name: string;
  logo?: string;
  type?: 'org' | 'user';
  size?: number;
};

export default function OrganizationLogo({
  name,
  logo,
  size = 44,
}: OrganizationLogoPropType) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-2xl object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center bg-accent/10 text-accent"
      style={{ width: size, height: size }}
    >
      <HugeiconsIcon icon={Building03Icon} size={size * 0.4} />
    </div>
  );
}
