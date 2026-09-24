import { getAvatarColor, getInitials } from '@/lib/utils';
import React from 'react';

type MemberInitialProps = {
  i: number;
  fullName: string;
};
export default function MemberInitial({ fullName, i }: MemberInitialProps) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center text-xs font-medium text-white ${getAvatarColor(i)}`}
    >
      {getInitials(fullName)}
    </div>
  );
}
