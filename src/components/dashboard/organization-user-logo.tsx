import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { Building03Icon, User02Icon } from '@hugeicons/core-free-icons';

type OrganizationOrUserLogoPropType = {
  name: string;
  logo?: string;
  type?: 'org' | 'user';
  size?: number;
};

export default function OrganizationOrUserLogo({
  name,
  logo,
  size = 44,
  type = 'org',
}: OrganizationOrUserLogoPropType) {
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
      className="flex shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent"
      style={{ width: size, height: size }}
    >
      {type === 'org' && (
        <HugeiconsIcon icon={Building03Icon} size={size * 0.4} />
      )}
      {type === 'user' && <HugeiconsIcon icon={User02Icon} size={size * 0.4} />}
    </div>
  );
}
