import { useState } from 'react';
import type { Transaction } from '@/types';
import { transactionService } from '@/services/transactionService';

interface UseDonationDeleteOptions {
  onSuccess?: () => void;
}

interface UseDonationDeleteReturn {
  deleteTarget: Transaction | null;
  isDeleteOpen: boolean;
  isDeleting: boolean;
  confirmDelete: (transaction: Transaction) => void;
  handleDeleteConfirm: () => Promise<void>;
  handleDeleteCancel: () => void;
}

export function useDonationDelete(options?: UseDonationDeleteOptions): UseDonationDeleteReturn {
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function confirmDelete(transaction: Transaction) {
    setDeleteTarget(transaction);
  }

  async function handleDeleteConfirm(): Promise<void> {
    if (deleteTarget === null) return;
    setIsDeleting(true);
    try {
      await transactionService.delete(deleteTarget.id);
      options?.onSuccess?.();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  function handleDeleteCancel() {
    setDeleteTarget(null);
  }

  return {
    deleteTarget,
    isDeleteOpen: deleteTarget !== null,
    isDeleting,
    confirmDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
}
