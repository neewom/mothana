import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Transaction } from '@/types';
import { transactionService } from '@/services/transactionService';

interface UseDonationFormResult {
  defaultUserId: number | undefined;
  isSaving: boolean;
  save: (data: Omit<Transaction, 'id'>) => Promise<void>;
}

export function useDonationForm(): UseDonationFormResult {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);

  const rawUserId = searchParams.get('userId');
  const defaultUserId = rawUserId !== null ? Number(rawUserId) : undefined;

  async function save(data: Omit<Transaction, 'id'>): Promise<void> {
    setIsSaving(true);
    try {
      await transactionService.create(data);
      navigate('/donations');
    } finally {
      setIsSaving(false);
    }
  }

  return { defaultUserId, isSaving, save };
}
