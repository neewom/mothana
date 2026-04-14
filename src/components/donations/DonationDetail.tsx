import type { Transaction, User, Activity, PaymentMethod, Civility } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Pencil, Trash2 } from 'lucide-react';

interface DonationDetailProps {
  transaction: Transaction;
  users: User[];
  activities: Activity[];
  paymentMethods: PaymentMethod[];
  civilities: Civility[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onClose: () => void;
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

const CHECK_LABEL = 'Chèque';

export function DonationDetail({
  transaction,
  users,
  activities,
  paymentMethods,
  civilities,
  onEdit,
  onDelete,
  onClose,
}: DonationDetailProps) {
  const user = users.find((u) => u.id === transaction.userId);
  const civility = civilities.find((c) => c.id === user?.civilityId);
  const activity = activities.find((a) => a.id === transaction.activityId);
  const paymentMethod = paymentMethods.find((p) => p.id === transaction.paymentMethod);

  const userLabel =
    [civility?.description, user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—';

  const isCheck = paymentMethod?.description === CHECK_LABEL;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold">Détail du don</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le panneau"
          className="rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Utilisateur</dt>
          <dd className="font-medium">{userLabel}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Date</dt>
          <dd className="font-medium">{formatDate(transaction.date)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Activité</dt>
          <dd className="font-medium">{activity?.description ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Montant</dt>
          <dd className="font-medium">{formatAmount(transaction.amount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Mode de paiement</dt>
          <dd className="font-medium">{paymentMethod?.description ?? '—'}</dd>
        </div>

        {isCheck && (
          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-muted-foreground font-medium">Informations chèque</p>
            <div>
              <dt className="text-muted-foreground">N° chèque</dt>
              <dd className="font-medium">{transaction.checkNumber || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Banque</dt>
              <dd className="font-medium">{transaction.bankName || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Ville de la banque</dt>
              <dd className="font-medium">{transaction.bankCity || '—'}</dd>
            </div>
          </div>
        )}

        {transaction.notes && (
          <div>
            <dt className="text-muted-foreground">Notes</dt>
            <dd className="font-medium">{transaction.notes}</dd>
          </div>
        )}
      </dl>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => onEdit(transaction)}>
          <Pencil className="mr-2 h-4 w-4" />
          Modifier
        </Button>
        <Button variant="destructive" onClick={() => onDelete(transaction)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </div>
    </div>
  );
}
