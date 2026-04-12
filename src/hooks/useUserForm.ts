import { useState } from 'react';
import type { User } from '@/types';
import { userService } from '@/services/userService';

interface UseUserFormOptions {
  onSuccess?: () => void;
}

interface UseUserFormReturn {
  isOpen: boolean;
  selectedUser: User | null;
  isSaving: boolean;
  openCreate: () => void;
  openEdit: (user: User) => void;
  close: () => void;
  save: (data: Omit<User, 'id'>) => Promise<void>;
}

export function useUserForm(options?: UseUserFormOptions): UseUserFormReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function openCreate() {
    setSelectedUser(null);
    setIsOpen(true);
  }

  function openEdit(user: User) {
    setSelectedUser(user);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setSelectedUser(null);
  }

  async function save(data: Omit<User, 'id'>): Promise<void> {
    setIsSaving(true);
    try {
      if (selectedUser === null) {
        await userService.create(data);
      } else {
        await userService.update(selectedUser.id, data);
      }
      options?.onSuccess?.();
      close();
    } finally {
      setIsSaving(false);
    }
  }

  return { isOpen, selectedUser, isSaving, openCreate, openEdit, close, save };
}
