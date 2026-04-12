import { Pencil, Trash2 } from 'lucide-react';
import type { User, Civility } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface UserTableProps {
  users: User[];
  civilities: Civility[];
  selectedUserId?: number;
  onSelect: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function resolveCivility(civilityId: number, civilities: Civility[]): string {
  return civilities.find((c) => c.id === civilityId)?.description ?? '';
}

export function UserTable({
  users,
  civilities,
  selectedUserId,
  onSelect,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-md border px-6 py-10 text-center text-sm text-muted-foreground">
        Aucun utilisateur trouvé
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Civilité</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead className="hidden sm:table-cell">Ville</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              data-state={selectedUserId === user.id ? 'selected' : undefined}
              className="cursor-pointer"
              onClick={() => onSelect(user)}
            >
              <TableCell>{resolveCivility(user.civilityId, civilities)}</TableCell>
              <TableCell className="font-medium">{user.lastName}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell className="hidden sm:table-cell">{user.city}</TableCell>
              <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
              <TableCell className="hidden sm:table-cell">{user.phone}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Modifier"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Supprimer"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
