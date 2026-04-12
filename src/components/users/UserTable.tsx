import type { User, Civility } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserTableProps {
  users: User[];
  civilities: Civility[];
  selectedUserId?: number;
  onSelect: (user: User) => void;
}

function resolveCivility(civilityId: number, civilities: Civility[]): string {
  return civilities.find((c) => c.id === civilityId)?.description ?? '';
}

export function UserTable({
  users,
  civilities,
  selectedUserId,
  onSelect,
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
