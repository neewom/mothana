import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';

const USERS_KEY = 'mothana_users';
const CIVILITIES_KEY = 'mothana_civilities';

beforeEach(() => {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(CIVILITIES_KEY);
});

describe('useUsers', () => {
  it('returns the full user list after loading', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.users.length).toBeGreaterThan(0);
  });

  it('returns civilities alongside users', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.civilities.length).toBeGreaterThan(0);
  });

  describe('searchUsers', () => {
    it('returns all users when query is empty', async () => {
      const { result } = renderHook(() => useUsers());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const all = result.current.users;
      expect(result.current.searchUsers('')).toEqual(all);
    });

    it('returns all users when query is only whitespace', async () => {
      const { result } = renderHook(() => useUsers());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const all = result.current.users;
      expect(result.current.searchUsers('   ')).toEqual(all);
    });

    it('filters by lastName (case-insensitive)', async () => {
      const { result } = renderHook(() => useUsers());
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const firstUser = result.current.users[0];
      const query = firstUser.lastName.slice(0, 3).toUpperCase();
      const filtered = result.current.searchUsers(query);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((u) => u.lastName.toLowerCase().includes(query.toLowerCase()))).toBe(true);
    });

    it('filters by firstName (case-insensitive)', async () => {
      const { result } = renderHook(() => useUsers());
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const firstUser = result.current.users[0];
      const query = firstUser.firstName.slice(0, 3).toLowerCase();
      const filtered = result.current.searchUsers(query);
      expect(filtered.some((u) => u.id === firstUser.id)).toBe(true);
    });

    it('filters by email', async () => {
      const { result } = renderHook(() => useUsers());
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const target = result.current.users[0];
      const filtered = result.current.searchUsers(target.email);
      expect(filtered.some((u) => u.id === target.id)).toBe(true);
    });

    it('filters by city', async () => {
      const { result } = renderHook(() => useUsers());
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const target = result.current.users[0];
      const filtered = result.current.searchUsers(target.city);
      expect(filtered.some((u) => u.id === target.id)).toBe(true);
    });

    it('returns an empty array when no users match', async () => {
      const { result } = renderHook(() => useUsers());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.searchUsers('xyzzy_no_match_42')).toEqual([]);
    });
  });
});
