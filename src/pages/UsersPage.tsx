import { useState, useCallback } from 'react';
import type { User } from '@/types';
import { useUsers } from '@/hooks/useUsers';
import { UserSearch } from '@/components/users/UserSearch';
import { UserTable } from '@/components/users/UserTable';

export function UsersPage() {
  const { civilities, isLoading, error, searchUsers } = useUsers();
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const filteredUsers = searchUsers(query);

  function handleSelect(user: User) {
    setSelectedUserId(user.id);
    console.log(user);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
        {!isLoading && !error && (
          <span className="text-sm text-muted-foreground">
            {filteredUsers.length} résultat{filteredUsers.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <UserSearch onSearch={handleSearch} />

      {isLoading && (
        <div className="space-y-2" aria-label="Chargement">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <UserTable
          users={filteredUsers}
          civilities={civilities}
          selectedUserId={selectedUserId}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
