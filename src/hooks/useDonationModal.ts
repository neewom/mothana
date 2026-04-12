import { useState } from 'react';
import type { Transaction } from '@/types';
import { transactionService } from '@/services/transactionService';

interface UseDonationModalOptions {
  onSuccess?: () => void;
}

interface UseDonationModalReturn {
  isOpen: boolean;
  selectedUserId: number | null;
  isSaving: boolean;
  openCreate: () => void;
  openCreateForUser: (userId: number) => void;
  close: () => void;
  save: (data: Omit<Transaction, 'id'>) => Promise<void>;
}

export function useDonationModal(options?: UseDonationModalOptions): UseDonationModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function openCreate() {
    setSelectedUserId(null);
    setIsOpen(true);
  }

  function openCreateForUser(userId: number) {
    setSelectedUserId(userId);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setSelectedUserId(null);
  }

  async function save(data: Omit<Transaction, 'id'>): Promise<void> {
    setIsSaving(true);
    try {
      await transactionService.create(data);
      options?.onSuccess?.();
      close();
    } finally {
      setIsSaving(false);
    }
  }

  return { isOpen, selectedUserId, isSaving, openCreate, openCreateForUser, close, save };
}
