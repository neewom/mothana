import { useMemo } from 'react';
import type { Transaction, Activity, PaymentMethod } from '@/types';

export interface ActivityStats {
  activity: Activity;
  count: number;
  totalAmount: number;
  checkTotal: number;
  cashTotal: number;
}

export interface DonationStats {
  totalCount: number;
  totalAmount: number;
  averageAmount: number;
  byActivity: ActivityStats[];
}

export function useDonationStats(
  transactions: Transaction[],
  activities: Activity[],
  paymentMethods: PaymentMethod[]
): DonationStats {
  return useMemo(() => {
    const checkId = paymentMethods.find((p) => p.description === 'Chèque')?.id;
    const cashId = paymentMethods.find((p) => p.description === 'Espèces')?.id;

    const totalCount = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageAmount = totalCount === 0 ? 0 : totalAmount / totalCount;

    const byActivity: ActivityStats[] = activities
      .map((activity) => {
        const actTxs = transactions.filter((t) => t.activityId === activity.id);
        return {
          activity,
          count: actTxs.length,
          totalAmount: actTxs.reduce((sum, t) => sum + t.amount, 0),
          checkTotal: actTxs
            .filter((t) => t.paymentMethod === checkId)
            .reduce((sum, t) => sum + t.amount, 0),
          cashTotal: actTxs
            .filter((t) => t.paymentMethod === cashId)
            .reduce((sum, t) => sum + t.amount, 0),
        };
      })
      .filter((s) => s.count > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return { totalCount, totalAmount, averageAmount, byActivity };
  }, [transactions, activities, paymentMethods]);
}
