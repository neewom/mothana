import { useState, useEffect, useCallback } from 'react';
import type { User, Civility } from '../types';
import { userService } from '../services/userService';
import { civilityService } from '../services/civilityService';

interface UseUsersReturn {
  users: User[];
  civilities: Civility[];
  isLoading: boolean;
  error: string | null;
  searchUsers: (query: string) => User[];
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [civilities, setCivilities] = useState<Civility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedUsers, fetchedCivilities] = await Promise.all([
          userService.getAll(),
          civilityService.getAll(),
        ]);
        if (!cancelled) {
          setUsers(fetchedUsers);
          setCivilities(fetchedCivilities);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load users');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const searchUsers = useCallback(
    (query: string): User[] => {
      const trimmed = query.trim().toLowerCase();
      if (!trimmed) return users;
      return users.filter(
        (u) =>
          u.lastName.toLowerCase().includes(trimmed) ||
          u.firstName.toLowerCase().includes(trimmed) ||
          u.email.toLowerCase().includes(trimmed) ||
          u.city.toLowerCase().includes(trimmed),
      );
    },
    [users],
  );

  return { users, civilities, isLoading, error, searchUsers };
}
