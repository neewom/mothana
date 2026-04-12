import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type { User } from '@/types';
import { useUsers } from '@/hooks/useUsers';
import { useUserForm } from '@/hooks/useUserForm';
import { useUserDelete } from '@/hooks/useUserDelete';
import { UserSearch } from '@/components/users/UserSearch';
import { UserTable } from '@/components/users/UserTable';
import { UserForm } from '@/components/users/UserForm';
import { UserDeleteDialog } from '@/components/users/UserDeleteDialog';
import { UserDonations } from '@/components/donations/UserDonations';
import { Button } from '@/components/ui/button';

export function UsersPage() {
  const { civilities, isLoading, error, searchUsers, reload } = useUsers();
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const isEditRef = useRef(false);

  const userForm = useUserForm({
    onSuccess: () => {
      reload();
      toast.success(isEditRef.current ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès');
    },
  });

  const userDelete = useUserDelete({
    onSuccess: () => {
      reload();
      setSelectedUser(undefined);
      toast.success('Utilisateur supprimé');
    },
  });

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
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold">Utilisateurs</h1>
          {!isLoading && !error && (
            <span className="text-sm text-muted-foreground">
              {filteredUsers.length} résultat{filteredUsers.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Button onClick={() => { isEditRef.current = false; userForm.openCreate(); }}>Nouvel utilisateur</Button>
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
            onEdit={(user) => { isEditRef.current = true; userForm.openEdit(user); }}
            onDelete={userDelete.confirmDelete}
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

      <UserForm
        isOpen={userForm.isOpen}
        selectedUser={userForm.selectedUser}
        isSaving={userForm.isSaving}
        onSave={userForm.save}
        onClose={userForm.close}
      />

      <UserDeleteDialog
        user={userDelete.deleteTarget}
        isOpen={userDelete.isDeleteOpen}
        isDeleting={userDelete.isDeleting}
        onConfirm={userDelete.handleDeleteConfirm}
        onCancel={userDelete.handleDeleteCancel}
      />
    </div>
  );
}
