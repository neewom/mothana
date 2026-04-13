import { useState } from 'react';
import type { Transaction } from '@/types';
import { transactionService } from '@/services/transactionService';

interface UseDonationModalOptions {
  onSuccess?: () => void;
}

interface UseDonationModalReturn {
  isOpen: boolean;
  selectedUserId: number | null;
  selectedTransaction: Transaction | null;
  isSaving: boolean;
  openCreate: () => void;
  openCreateForUser: (userId: number) => void;
  openEdit: (transaction: Transaction) => void;
  close: () => void;
  save: (data: Omit<Transaction, 'id'>) => Promise<void>;
}

export function useDonationModal(options?: UseDonationModalOptions): UseDonationModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function openCreate() {
    setSelectedTransaction(null);
    setSelectedUserId(null);
    setIsOpen(true);
  }

  function openCreateForUser(userId: number) {
    setSelectedTransaction(null);
    setSelectedUserId(userId);
    setIsOpen(true);
  }

  function openEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setSelectedUserId(null);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setSelectedUserId(null);
    setSelectedTransaction(null);
  }

  async function save(data: Omit<Transaction, 'id'>): Promise<void> {
    setIsSaving(true);
    try {
      if (selectedTransaction === null) {
        await transactionService.create(data);
      } else {
        await transactionService.update(selectedTransaction.id, data);
      }
      options?.onSuccess?.();
      close();
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isOpen,
    selectedUserId,
    selectedTransaction,
    isSaving,
    openCreate,
    openCreateForUser,
    openEdit,
    close,
    save,
  };
}
