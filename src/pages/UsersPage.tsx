import { useState, useCallback } from 'react';
import type { User } from '@/types';
import { useUsers } from '@/hooks/useUsers';
import { UserSearch } from '@/components/users/UserSearch';
import { UserTable } from '@/components/users/UserTable';
import { UserDonations } from '@/components/donations/UserDonations';

export function UsersPage() {
  const { civilities, isLoading, error, searchUsers } = useUsers();
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const filteredUsers = searchUsers(query);

  function handleSelect(user: User) {
    setSelectedUser(user);
  }

  function handleClosePanel() {
    setSelectedUser(undefined);
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
        <div className={selectedUser ? 'grid gap-4 lg:grid-cols-2' : undefined}>
          <UserTable
            users={filteredUsers}
            civilities={civilities}
            selectedUserId={selectedUser?.id}
            onSelect={handleSelect}
          />
          {selectedUser && (
            <UserDonations
              user={selectedUser}
              civilities={civilities}
              onClose={handleClosePanel}
            />
          )}
        </div>
      )}
    </div>
  );
}
