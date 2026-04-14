import type { Transaction, User, Activity, PaymentMethod } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DonationTableProps {
  transactions: Transaction[];
  users: User[];
  activities: Activity[];
  paymentMethods: PaymentMethod[];
  selectedTransactionId?: number;
  onSelect: (transaction: Transaction) => void;
}

function formatDate(isoDate: string): string {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function formatAmount(amount: number): string {
  return (
    amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €'
  );
}

export function DonationTable({
  transactions,
  users,
  activities,
  paymentMethods,
  selectedTransactionId,
  onSelect,
}: DonationTableProps) {
  const userMap = new Map(users.map((u) => [u.id, `${u.firstName} ${u.lastName}`]));
  const activityMap = new Map(activities.map((a) => [a.id, a.description]));
  const paymentMethodMap = new Map(paymentMethods.map((p) => [p.id, p.description]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead className="hidden sm:table-cell">Activité</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead className="hidden sm:table-cell">Règlement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Aucun don trouvé
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              onClick={() => onSelect(transaction)}
              className="cursor-pointer"
              data-state={selectedTransactionId === transaction.id ? 'selected' : undefined}
            >
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>{userMap.get(transaction.userId) ?? '—'}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {activityMap.get(transaction.activityId) ?? '—'}
              </TableCell>
              <TableCell>{formatAmount(transaction.amount)}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {paymentMethodMap.get(transaction.paymentMethod) ?? '—'}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
