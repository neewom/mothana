import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserDelete } from './useUserDelete';

const USERS_KEY = 'mothana_users';

beforeEach(() => {
  localStorage.removeItem(USERS_KEY);
});

const user = {
  id: 1,
  civilityId: 1,
  lastName: 'Dupont',
  firstName: 'Jean',
  address: '',
  zip: '',
  city: '',
  email: '',
  phone: '',
  fax: '',
  memberNumber: 0,
  laoLastName: '',
  amount: 0,
};

describe('useUserDelete', () => {
  it('starts with no delete target and dialog closed', () => {
    const { result } = renderHook(() => useUserDelete());
    expect(result.current.deleteTarget).toBeNull();
    expect(result.current.isDeleteOpen).toBe(false);
    expect(result.current.isDeleting).toBe(false);
  });

  it('opens dialog when confirmDelete is called', () => {
    const { result } = renderHook(() => useUserDelete());
    act(() => result.current.confirmDelete(user));
    expect(result.current.deleteTarget).toEqual(user);
    expect(result.current.isDeleteOpen).toBe(true);
  });

  it('clears target and closes dialog on cancel', () => {
    const { result } = renderHook(() => useUserDelete());
    act(() => result.current.confirmDelete(user));
    act(() => result.current.handleDeleteCancel());
    expect(result.current.deleteTarget).toBeNull();
    expect(result.current.isDeleteOpen).toBe(false);
  });

  it('does nothing when handleDeleteConfirm is called with no target', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useUserDelete({ onSuccess }));
    await act(() => result.current.handleDeleteConfirm());
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('deletes user, calls onSuccess, and clears target on confirm', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useUserDelete({ onSuccess }));
    act(() => result.current.confirmDelete(user));
    await act(() => result.current.handleDeleteConfirm());
    expect(onSuccess).toHaveBeenCalledOnce();
    await waitFor(() => expect(result.current.deleteTarget).toBeNull());
    expect(result.current.isDeleteOpen).toBe(false);
  });

  it('sets isDeleting during deletion and resets after', async () => {
    const { result } = renderHook(() => useUserDelete());
    act(() => result.current.confirmDelete(user));
    const deletePromise = act(() => result.current.handleDeleteConfirm());
    await deletePromise;
    expect(result.current.isDeleting).toBe(false);
  });
});
