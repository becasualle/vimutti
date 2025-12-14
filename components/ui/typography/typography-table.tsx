import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TypographyTableProps {
  children: ReactNode;
  className?: string;
}

export function TypographyTable({ children, className }: TypographyTableProps) {
  return (
    <div className={cn('my-6 overflow-x-auto', className)}>
      <table className="w-full border-collapse border border-border rounded-md">{children}</table>
    </div>
  );
}

interface TypographyTableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TypographyTableHead({ children, className }: TypographyTableHeadProps) {
  return <thead className={cn('bg-muted/50', className)}>{children}</thead>;
}

interface TypographyTableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TypographyTableBody({ children, className }: TypographyTableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

interface TypographyTableRowProps {
  children: ReactNode;
  className?: string;
}

export function TypographyTableRow({ children, className }: TypographyTableRowProps) {
  return <tr className={cn('border-b border-border last:border-b-0', className)}>{children}</tr>;
}

interface TypographyTableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TypographyTableHeader({ children, className }: TypographyTableHeaderProps) {
  return (
    <th className={cn('px-4 py-3 text-left font-semibold text-foreground align-top', className)}>
      {children}
    </th>
  );
}

interface TypographyTableCellProps {
  children: ReactNode;
  className?: string;
}

export function TypographyTableCell({ children, className }: TypographyTableCellProps) {
  return <td className={cn('px-4 py-3 text-foreground align-top', className)}>{children}</td>;
}
