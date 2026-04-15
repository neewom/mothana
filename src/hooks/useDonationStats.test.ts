import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDonationStats } from './useDonationStats';
import type { Transaction, Activity, PaymentMethod } from '@/types';

const activities: Activity[] = [
  {
    id: 1,
    description: 'Collecte 2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    estimation: 0,
    total: 0,
    expense: 0,
    checkTotal: 0,
    cashTotal: 0,
  },
  {
    id: 2,
    description: 'Parrainage 2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    estimation: 0,
    total: 0,
    expense: 0,
    checkTotal: 0,
    cashTotal: 0,
  },
];

const paymentMethods: PaymentMethod[] = [
  { id: 1, description: 'Chèque' },
  { id: 2, description: 'Espèces' },
  { id: 3, description: 'Virement' },
];

const transactions: Transaction[] = [
  { id: 1, activityId: 1, userId: 1, date: '2024-01-15', amount: 100, paymentMethod: 1, notes: '', checkNumber: 0, bankName: '', bankCity: '' },
  { id: 2, activityId: 1, userId: 2, date: '2024-02-10', amount: 50, paymentMethod: 2, notes: '', checkNumber: 0, bankName: '', bankCity: '' },
  { id: 3, activityId: 2, userId: 1, date: '2024-03-05', amount: 200, paymentMethod: 1, notes: '', checkNumber: 0, bankName: '', bankCity: '' },
  { id: 4, activityId: 2, userId: 3, date: '2024-04-20', amount: 75, paymentMethod: 3, notes: '', checkNumber: 0, bankName: '', bankCity: '' },
];

describe('useDonationStats', () => {
  it('returns correct totalCount', () => {
    const { result } = renderHook(() => useDonationStats(transactions, activities, paymentMethods));
    expect(result.current.totalCount).toBe(4);
  });

  it('returns correct totalAmount', () => {
    const { result } = renderHook(() => useDonationStats(transactions, activities, paymentMethods));
    expect(result.current.totalAmount).toBe(425);
  });

  it('returns correct averageAmount', () => {
    const { result } = renderHook(() => useDonationStats(transactions, activities, paymentMethods));
    expect(result.current.averageAmount).toBeCloseTo(106.25);
  });

  it('returns averageAmount of 0 when no transactions', () => {
    const { result } = renderHook(() => useDonationStats([], activities, paymentMethods));
    expect(result.current.averageAmount).toBe(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('returns byActivity sorted by totalAmount descending', () => {
    const { result } = renderHook(() => useDonationStats(transactions, activities, paymentMethods));
    const amounts = result.current.byActivity.map((s) => s.totalAmount);
    expect(amounts).toEqual([...amounts].sort((a, b) => b - a));
  });

  it('returns correct per-activity count and totalAmount', () => {
    const { result } = renderHook(() => useDonationStats(transactions, activities, paymentMethods));
    const act1Stats = result.current.byActivity.find((s) => s.activity.id === 1);
    const act2Stats = result.current.byActivity.find((s) => s.activity.id === 2);
    expect(act1Stats?.count).toBe(2);
    expect(act1Stats?.totalAmount).toBe(150);
    expect(act2Stats?.count).toBe(2);
    expect(act2Stats?.totalAmount).toBe(275);
  });

  it('returns correct checkTotal per activity', () => {
    const { result } = renderHook(() => useDonationStats(transactions, activities, paymentMethods));
    const act1Stats = result.current.byActivity.find((s) => s.activity.id === 1);
    const act2Stats = result.current.byActivity.find((s) => s.activity.id === 2);
    expect(act1Stats?.checkTotal).toBe(100);
    expect(act2Stats?.checkTotal).toBe(200);
  });

  it('returns correct cashTotal per activity', () => {
    const { result } = renderHook(() => useDonationStats(transactions, activities, paymentMethods));
    const act1Stats = result.current.byActivity.find((s) => s.activity.id === 1);
    const act2Stats = result.current.byActivity.find((s) => s.activity.id === 2);
    expect(act1Stats?.cashTotal).toBe(50);
    expect(act2Stats?.cashTotal).toBe(0);
  });

  it('excludes activities with no matching transactions from byActivity', () => {
    const extraActivities: Activity[] = [
      ...activities,
      { id: 3, description: 'Vide', startDate: '2024-01-01', endDate: '2024-12-31', estimation: 0, total: 0, expense: 0, checkTotal: 0, cashTotal: 0 },
    ];
    const { result } = renderHook(() => useDonationStats(transactions, extraActivities, paymentMethods));
    const ids = result.current.byActivity.map((s) => s.activity.id);
    expect(ids).not.toContain(3);
  });

  it('returns empty byActivity when no transactions', () => {
    const { result } = renderHook(() => useDonationStats([], activities, paymentMethods));
    expect(result.current.byActivity).toHaveLength(0);
  });
});
