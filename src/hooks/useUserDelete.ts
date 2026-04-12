import { useState } from 'react';
import type { User } from '@/types';
import { userService } from '@/services/userService';

interface UseUserDeleteOptions {
  onSuccess?: () => void;
}

interface UseUserDeleteReturn {
  deleteTarget: User | null;
  isDeleteOpen: boolean;
  isDeleting: boolean;
  confirmDelete: (user: User) => void;
  handleDeleteConfirm: () => Promise<void>;
  handleDeleteCancel: () => void;
}

export function useUserDelete(options?: UseUserDeleteOptions): UseUserDeleteReturn {
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function confirmDelete(user: User) {
    setDeleteTarget(user);
  }

  async function handleDeleteConfirm(): Promise<void> {
    if (deleteTarget === null) return;
    setIsDeleting(true);
    try {
      await userService.delete(deleteTarget.id);
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
