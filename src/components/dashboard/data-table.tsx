'use client';

import { DataTableFeatures, features } from '@/lib/data-table-features';
import {
  ArrowDown02Icon,
  ArrowUp02Icon,
  ArrowUpDownIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTable, type ColumnDef, type RowData } from '@tanstack/react-table';
import type { ComponentProps } from 'react';

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto bg-white/4"
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-10 px-3 text-left align-middle font-medium whitespace-nowrap text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn('p-3 align-middle', className)}
      {...props}
    />
  );
}

export type DataTableColumnDef = ColumnDef<DataTableFeatures, RowData>;

export interface DataTableProps<TData extends RowData> {
  tableKey?: string;
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  skeletonRows?: number;
  showRowNumbers?: boolean;
  caption?: string;
  className?: string;
}

export function DataTable<TData extends RowData>({
  tableKey,
  columns,
  data,
  isLoading = false,
  isError = false,
  emptyMessage = 'No results.',
  errorMessage = 'Failed to load data.',
  skeletonRows = 5,
  showRowNumbers = true,
  className,
}: DataTableProps<TData>) {
  const table = useTable(
    {
      key: tableKey,
      features,
      columns,
      data,
    },
    // Subscribe to all table state so the component re-renders on sort changes.
    (state) => state,
  );

  const rows = table.getRowModel().rows;
  const columnCount = columns.length + (showRowNumbers ? 1 : 0);

  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted(); // false | "asc" | "desc"

                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={
                      sorted === 'asc'
                        ? 'ascending'
                        : sorted === 'desc'
                          ? 'descending'
                          : canSort
                            ? 'none'
                            : undefined
                    }
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="-ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <table.FlexRender header={header} />
                        {sorted === 'asc' ? (
                          <HugeiconsIcon
                            icon={ArrowUp02Icon}
                            aria-hidden
                            className="size-3.5"
                          />
                        ) : sorted === 'desc' ? (
                          <HugeiconsIcon
                            icon={ArrowDown02Icon}
                            aria-hidden
                            className="size-3.5"
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={ArrowUpDownIcon}
                            aria-hidden
                            className="size-3.5 text-muted-foreground"
                          />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell key={`skeleton-cell-${i}-${j}`}>
                    <div className="h-4 animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isError ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columnCount}
                className="h-24 text-center text-destructive"
              >
                {errorMessage}
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columnCount}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
