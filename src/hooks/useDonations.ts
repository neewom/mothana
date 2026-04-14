import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Activity, PaymentMethod, User, Civility, DonationFilters } from '@/types';
import { transactionService } from '@/services/transactionService';
import { activityService } from '@/services/activityService';
import { paymentMethodService } from '@/services/paymentMethodService';
import { userService } from '@/services/userService';
import { civilityService } from '@/services/civilityService';

interface UseDonationsResult {
  transactions: Transaction[];
  users: User[];
  activities: Activity[];
  paymentMethods: PaymentMethod[];
  civilities: Civility[];
  isLoading: boolean;
  error: string | null;
  filterDonations: (filters: DonationFilters) => Transaction[];
  reload: () => void;
}

export function useDonations(): UseDonationsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [civilities, setCivilities] = useState<Civility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      transactionService.getAll(),
      userService.getAll(),
      activityService.getAll(),
      paymentMethodService.getAll(),
      civilityService.getAll(),
    ])
      .then(([txs, us, acts, methods, civs]) => {
        if (cancelled) return;
        setTransactions(txs);
        setUsers(us);
        setActivities(acts);
        setPaymentMethods(methods);
        setCivilities(civs);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  const filterDonations = useCallback(
    (filters: DonationFilters): Transaction[] => {
      return transactions.filter((t) => {
        if (filters.userId !== undefined && t.userId !== filters.userId) return false;
        if (filters.activityId !== undefined && t.activityId !== filters.activityId) return false;
        if (filters.paymentMethodId !== undefined && t.paymentMethod !== filters.paymentMethodId) return false;
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        return true;
      });
    },
    [transactions]
  );

  return { transactions, users, activities, paymentMethods, civilities, isLoading, error, filterDonations, reload };
}
