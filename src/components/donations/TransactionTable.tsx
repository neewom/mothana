import type { Transaction, Activity, PaymentMethod } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  activities: Activity[];
  paymentMethods: PaymentMethod[];
  selectedTransactionId?: number;
  onSelect: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

export function TransactionTable({
  transactions,
  activities,
  paymentMethods,
  selectedTransactionId,
  onSelect,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const activityMap = new Map(activities.map((a) => [a.id, a.description]));
  const paymentMethodMap = new Map(paymentMethods.map((p) => [p.id, p.description]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Activité</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead className="hidden sm:table-cell">Règlement</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Aucun don enregistré pour cet utilisateur
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
              <TableCell>{activityMap.get(transaction.activityId) ?? '—'}</TableCell>
              <TableCell>{formatAmount(transaction.amount)}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {paymentMethodMap.get(transaction.paymentMethod) ?? '—'}
              </TableCell>
              <TableCell>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Modifier"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Supprimer"
                    onClick={() => onDelete(transaction)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
