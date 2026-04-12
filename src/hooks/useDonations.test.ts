import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDonations } from './useDonations';

const TRANSACTIONS_KEY = 'mothana_transactions';
const USERS_KEY = 'mothana_users';
const ACTIVITIES_KEY = 'mothana_activities';
const PAYMENT_METHODS_KEY = 'mothana_payment_methods';

beforeEach(() => {
  localStorage.removeItem(TRANSACTIONS_KEY);
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(ACTIVITIES_KEY);
  localStorage.removeItem(PAYMENT_METHODS_KEY);
});

describe('useDonations', () => {
  it('returns all transactions after loading', async () => {
    const { result } = renderHook(() => useDonations());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.transactions.length).toBeGreaterThan(0);
  });

  describe('filterDonations', () => {
    it('returns all transactions when no filters set', async () => {
      const { result } = renderHook(() => useDonations());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const all = result.current.transactions;
      expect(result.current.filterDonations({})).toEqual(all);
    });

    it('filters by userId', async () => {
      const { result } = renderHook(() => useDonations());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const filtered = result.current.filterDonations({ userId: 1 });
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((t) => t.userId === 1)).toBe(true);
    });

    it('filters by activityId', async () => {
      const { result } = renderHook(() => useDonations());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const filtered = result.current.filterDonations({ activityId: 2 });
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((t) => t.activityId === 2)).toBe(true);
    });

    it('filters by paymentMethodId', async () => {
      const { result } = renderHook(() => useDonations());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const filtered = result.current.filterDonations({ paymentMethodId: 1 });
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((t) => t.paymentMethod === 1)).toBe(true);
    });

    it('filters by dateFrom', async () => {
      const { result } = renderHook(() => useDonations());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const filtered = result.current.filterDonations({ dateFrom: '2024-06-01' });
      expect(filtered.every((t) => t.date >= '2024-06-01')).toBe(true);
    });

    it('filters by dateTo', async () => {
      const { result } = renderHook(() => useDonations());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const filtered = result.current.filterDonations({ dateTo: '2024-03-31' });
      expect(filtered.every((t) => t.date <= '2024-03-31')).toBe(true);
    });

    it('combines multiple filters', async () => {
      const { result } = renderHook(() => useDonations());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const filtered = result.current.filterDonations({ userId: 1, activityId: 1 });
      expect(filtered.every((t) => t.userId === 1 && t.activityId === 1)).toBe(true);
    });
  });
});
