'use client';

import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPage = Number(searchParams.get('page')) || 1;
  const currentPage = Math.min(Math.max(rawPage, 1), Math.max(totalPages, 1));

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex gap-2.5 justify-end my-10">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      {pages.map((page, i) =>
        page === '...' ? (
          <PaginationEllipsis key={`ellipsis-${i}`} />
        ) : (
          <PaginationNumber
            key={page}
            href={createPageURL(page)}
            page={page}
            isActive={currentPage === page}
          />
        ),
      )}

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function generatePagination(
  currentPage: number,
  totalPages: number,
): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      '...',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}

function PaginationNumber({
  page,
  href,
  isActive,
}: {
  page: number;
  href: string;
  isActive: boolean;
}) {
  const baseClasses =
    'flex h-10 w-10 rounded-md items-center justify-center text-sm text-white';

  return isActive ? (
    <div
      className={`${baseClasses} bg-primary border border-primary`}
      aria-current="page"
    >
      {page}
    </div>
  ) : (
    <Link
      href={href}
      className={`${baseClasses} border border-primary hover:bg-primary/20`}
    >
      {page}
    </Link>
  );
}

function PaginationEllipsis() {
  return (
    <div className="flex h-10 w-10 items-center justify-center text-sm text-gray-400">
      …
    </div>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const content =
    direction === 'left' ? (
      <>
        <HugeiconsIcon icon={ArrowLeft01Icon} />
        <p>Previous</p>
      </>
    ) : (
      <>
        <p>Next</p>
        <HugeiconsIcon icon={ArrowRight01Icon} />
      </>
    );

  const baseClasses =
    'flex px-5 gap-1 items-center justify-center rounded-md border';

  return isDisabled ? (
    <div
      className={`${baseClasses} pointer-events-none text-gray-400 border-gray-400`}
      aria-disabled="true"
    >
      {content}
    </div>
  ) : (
    <Link
      className={`${baseClasses} border-primary text-white hover:bg-primary/20`}
      href={href}
    >
      {content}
    </Link>
  );
}
