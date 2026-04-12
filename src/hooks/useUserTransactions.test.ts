import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserTransactions } from './useUserTransactions';

const TRANSACTIONS_KEY = 'mothana_transactions';
const ACTIVITIES_KEY = 'mothana_activities';
const PAYMENT_METHODS_KEY = 'mothana_payment_methods';

beforeEach(() => {
  localStorage.removeItem(TRANSACTIONS_KEY);
  localStorage.removeItem(ACTIVITIES_KEY);
  localStorage.removeItem(PAYMENT_METHODS_KEY);
});

describe('useUserTransactions', () => {
  it('returns empty state when userId is null', () => {
    const { result } = renderHook(() => useUserTransactions(null));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.transactions).toEqual([]);
    expect(result.current.activities).toEqual([]);
    expect(result.current.paymentMethods).toEqual([]);
  });

  it('loads transactions, activities and paymentMethods for a valid user', async () => {
    const { result } = renderHook(() => useUserTransactions(1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.transactions.length).toBeGreaterThan(0);
    expect(result.current.activities.length).toBeGreaterThan(0);
    expect(result.current.paymentMethods.length).toBeGreaterThan(0);
  });

  it('returns only transactions for the given user', async () => {
    const { result } = renderHook(() => useUserTransactions(1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.transactions.every((t) => t.userId === 1)).toBe(true);
  });

  it('returns empty transactions array for a user with no transactions', async () => {
    const { result } = renderHook(() => useUserTransactions(9999));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.transactions).toEqual([]);
  });

  it('activities contain all referenced activityIds', async () => {
    const { result } = renderHook(() => useUserTransactions(1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const activityIds = new Set(result.current.activities.map((a) => a.id));
    result.current.transactions.forEach((t) => {
      expect(activityIds.has(t.activityId)).toBe(true);
    });
  });

  it('paymentMethods contain all referenced payment method ids', async () => {
    const { result } = renderHook(() => useUserTransactions(1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const methodIds = new Set(result.current.paymentMethods.map((p) => p.id));
    result.current.transactions.forEach((t) => {
      expect(methodIds.has(t.paymentMethod)).toBe(true);
    });
  });

  it('updates transactions when userId changes', async () => {
    const { result, rerender } = renderHook(
      ({ userId }: { userId: number | null }) => useUserTransactions(userId),
      { initialProps: { userId: 1 as number | null } },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.transactions.every((t) => t.userId === 1)).toBe(true);

    rerender({ userId: 2 });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.transactions.every((t) => t.userId === 2)).toBe(true);
  });

  it('clears transactions when userId changes to null', async () => {
    const { result, rerender } = renderHook(
      ({ userId }: { userId: number | null }) => useUserTransactions(userId),
      { initialProps: { userId: 1 as number | null } },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.transactions.length).toBeGreaterThan(0);

    rerender({ userId: null });
    expect(result.current.transactions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
