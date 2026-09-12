'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ModalProps = {
  /** Controls whether the dialog is open. Omit for an uncontrolled dialog driven purely by `trigger`. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Element that opens the dialog when clicked (e.g. a `<Button>`).
   * Wrapped in `DialogTrigger asChild`. Omit if you're opening the
   * dialog programmatically (e.g. from a dropdown menu item) — in that
   * case, control it fully via `open`/`onOpenChange` instead.
   */
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  /** Rendered inside DialogFooter. Omit for a dialog with no footer actions. */
  footer?: React.ReactNode;
  className?: string;
};

export default function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  /** 'destructive' for things like logout/delete; 'default' for neutral confirmations. */
  variant?: 'default' | 'destructive';
};

/**
 * Convenience wrapper around Modal for the common "are you sure?" pattern —
 * logout, delete, revoke, etc. For anything with real form fields, use
 * Modal directly instead so you control the footer buttons and submit flow.
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isLoading = false,
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </Button>
        </>
      }
    />
  );
}
