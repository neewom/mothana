import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDonationModal } from './useDonationModal';

const STORAGE_KEY = 'mothana_transactions';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

const newDonationData = {
  activityId: 1,
  userId: 1,
  date: '2024-08-01',
  amount: 50,
  paymentMethod: 1,
  notes: '',
  checkNumber: 0,
  bankName: '',
  bankCity: '',
  checkDate: '',
};

describe('useDonationModal', () => {
  it('starts closed with null selectedUserId', () => {
    const { result } = renderHook(() => useDonationModal());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedUserId).toBeNull();
    expect(result.current.isSaving).toBe(false);
  });

  it('openCreate opens with null selectedUserId', () => {
    const { result } = renderHook(() => useDonationModal());
    act(() => result.current.openCreate());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedUserId).toBeNull();
  });

  it('openCreateForUser opens with the given userId', () => {
    const { result } = renderHook(() => useDonationModal());
    act(() => result.current.openCreateForUser(42));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedUserId).toBe(42);
  });

  it('close sets isOpen to false and clears selectedUserId', () => {
    const { result } = renderHook(() => useDonationModal());
    act(() => result.current.openCreateForUser(5));
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedUserId).toBeNull();
  });

  it('save calls transactionService.create and closes', async () => {
    const { result } = renderHook(() => useDonationModal());
    act(() => result.current.openCreate());
    await act(() => result.current.save(newDonationData));
    await waitFor(() => expect(result.current.isOpen).toBe(false));
  });

  it('save calls onSuccess after create', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useDonationModal({ onSuccess }));
    act(() => result.current.openCreate());
    await act(() => result.current.save(newDonationData));
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('sets isSaving to false after save completes', async () => {
    const { result } = renderHook(() => useDonationModal());
    act(() => result.current.openCreate());
    await act(() => result.current.save(newDonationData));
    expect(result.current.isSaving).toBe(false);
  });
});
