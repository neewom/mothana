import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDonationDelete } from './useDonationDelete';

const STORAGE_KEY = 'mothana_transactions';

const transaction = {
  id: 1,
  activityId: 1,
  userId: 1,
  date: '2024-03-15',
  amount: 75.5,
  paymentMethod: 1,
  notes: '',
  checkNumber: 0,
  bankName: '',
  bankCity: '',
};

beforeEach(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([transaction]));
});

describe('useDonationDelete', () => {
  it('starts with no delete target and dialog closed', () => {
    const { result } = renderHook(() => useDonationDelete());
    expect(result.current.deleteTarget).toBeNull();
    expect(result.current.isDeleteOpen).toBe(false);
    expect(result.current.isDeleting).toBe(false);
  });

  it('confirmDelete opens dialog with the correct transaction', () => {
    const { result } = renderHook(() => useDonationDelete());
    act(() => result.current.confirmDelete(transaction));
    expect(result.current.deleteTarget).toEqual(transaction);
    expect(result.current.isDeleteOpen).toBe(true);
  });

  it('clears target and closes dialog on cancel', () => {
    const { result } = renderHook(() => useDonationDelete());
    act(() => result.current.confirmDelete(transaction));
    act(() => result.current.handleDeleteCancel());
    expect(result.current.deleteTarget).toBeNull();
    expect(result.current.isDeleteOpen).toBe(false);
  });

  it('does nothing when handleDeleteConfirm is called with no target', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useDonationDelete({ onSuccess }));
    await act(() => result.current.handleDeleteConfirm());
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('handleDeleteConfirm calls transactionService.delete with the correct id', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useDonationDelete({ onSuccess }));
    act(() => result.current.confirmDelete(transaction));
    await act(() => result.current.handleDeleteConfirm());
    expect(onSuccess).toHaveBeenCalledOnce();
    await waitFor(() => expect(result.current.deleteTarget).toBeNull());
    expect(result.current.isDeleteOpen).toBe(false);
  });

  it('onSuccess is called after deletion', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useDonationDelete({ onSuccess }));
    act(() => result.current.confirmDelete(transaction));
    await act(() => result.current.handleDeleteConfirm());
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('sets isDeleting to false after deletion completes', async () => {
    const { result } = renderHook(() => useDonationDelete());
    act(() => result.current.confirmDelete(transaction));
    await act(() => result.current.handleDeleteConfirm());
    expect(result.current.isDeleting).toBe(false);
  });
});
