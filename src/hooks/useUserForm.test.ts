import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserForm } from './useUserForm';

const USERS_KEY = 'mothana_users';

beforeEach(() => {
  localStorage.removeItem(USERS_KEY);
});

const newUserData = {
  civilityId: 1,
  lastName: 'Dupont',
  firstName: 'Jean',
  address: '1 rue Test',
  zip: '75001',
  city: 'Paris',
  email: 'jean@test.fr',
  phone: '0600000000',
  fax: '',
  memberNumber: 1,
  laoLastName: '',
  amount: 50,
};

describe('useUserForm', () => {
  it('starts closed with no selected user', () => {
    const { result } = renderHook(() => useUserForm());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedUser).toBeNull();
    expect(result.current.isSaving).toBe(false);
  });

  it('opens for create with no selected user', () => {
    const { result } = renderHook(() => useUserForm());
    act(() => result.current.openCreate());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedUser).toBeNull();
  });

  it('opens for edit with the selected user', () => {
    const { result } = renderHook(() => useUserForm());
    const user = { id: 1, ...newUserData };
    act(() => result.current.openEdit(user));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedUser).toEqual(user);
  });

  it('closes and clears selected user', () => {
    const { result } = renderHook(() => useUserForm());
    const user = { id: 1, ...newUserData };
    act(() => result.current.openEdit(user));
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedUser).toBeNull();
  });

  it('creates a user and calls onSuccess then closes', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useUserForm({ onSuccess }));
    act(() => result.current.openCreate());
    await act(() => result.current.save(newUserData));
    expect(onSuccess).toHaveBeenCalledOnce();
    await waitFor(() => expect(result.current.isOpen).toBe(false));
  });

  it('updates a user and calls onSuccess then closes', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useUserForm({ onSuccess }));
    const user = { id: 1, ...newUserData };
    act(() => result.current.openEdit(user));
    await act(() => result.current.save({ ...newUserData, lastName: 'Updated' }));
    expect(onSuccess).toHaveBeenCalledOnce();
    await waitFor(() => expect(result.current.isOpen).toBe(false));
  });

  it('sets isSaving to true while saving and false after', async () => {
    const { result } = renderHook(() => useUserForm());
    act(() => result.current.openCreate());
    const savePromise = act(() => result.current.save(newUserData));
    await savePromise;
    expect(result.current.isSaving).toBe(false);
  });
});
