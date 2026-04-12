import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Activity, PaymentMethod } from '@/types';
import { transactionService } from '@/services/transactionService';
import { activityService } from '@/services/activityService';
import { paymentMethodService } from '@/services/paymentMethodService';

interface UseUserTransactionsResult {
  transactions: Transaction[];
  activities: Activity[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useUserTransactions(userId: number | null): UseUserTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (userId === null) {
      setTransactions([]);
      setActivities([]);
      setPaymentMethods([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      transactionService.getByUserId(userId),
      activityService.getAll(),
      paymentMethodService.getAll(),
    ])
      .then(([txs, acts, methods]) => {
        if (cancelled) return;
        setTransactions(txs);
        setActivities(acts);
        setPaymentMethods(methods);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des dons');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { transactions, activities, paymentMethods, isLoading, error, reload };
}
