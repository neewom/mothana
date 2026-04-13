import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { User, Civility, Transaction } from '@/types';
import { useUserTransactions } from '@/hooks/useUserTransactions';
import { useDonationModal } from '@/hooks/useDonationModal';
import { useDonationDelete } from '@/hooks/useDonationDelete';
import { DonationForm } from './DonationForm';
import { DonationDeleteDialog } from './DonationDeleteDialog';
import { TransactionTable } from './TransactionTable';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UserDonationsProps {
  user: User;
  civilities: Civility[];
  onClose: () => void;
}

export function UserDonations({ user, civilities, onClose }: UserDonationsProps) {
  const { transactions, activities, paymentMethods, isLoading, error, reload } =
    useUserTransactions(user.id);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | undefined>();
  const isEditRef = useRef(false);

  const donationModal = useDonationModal({
    onSuccess: () => {
      reload();
      toast.success(isEditRef.current ? 'Don modifié avec succès' : 'Don enregistré avec succès');
    },
  });

  const donationDelete = useDonationDelete({
    onSuccess: () => {
      reload();
      toast.success('Don supprimé');
    },
  });

  const civilityLabel = civilities.find((c) => c.id === user.civilityId)?.description ?? '';
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  function handleSelect(transaction: Transaction) {
    setSelectedTransactionId(transaction.id);
  }

  function handleEdit(transaction: Transaction) {
    isEditRef.current = true;
    donationModal.openEdit(transaction);
  }

  function handleOpenCreateForUser() {
    isEditRef.current = false;
    donationModal.openCreateForUser(user.id);
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">
            {[civilityLabel, user.firstName, user.lastName].filter(Boolean).join(' ')}
          </h2>
          {!isLoading && !error && (
            <p className="text-sm text-muted-foreground">
              Total :{' '}
              <span className="font-medium text-foreground">
                {total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
              {' · '}
              {transactions.length} don{transactions.length !== 1 ? 's' : ''}
            </p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenCreateForUser}
          >
            Ajouter un don pour cet utilisateur
          </Button>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le panneau des dons"
          className="rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isLoading && (
        <div className="space-y-2" aria-label="Chargement">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <TransactionTable
          transactions={transactions}
          activities={activities}
          paymentMethods={paymentMethods}
          selectedTransactionId={selectedTransactionId}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={(transaction) => donationDelete.confirmDelete(transaction)}
        />
      )}

      <DonationForm
        isOpen={donationModal.isOpen}
        selectedUserId={donationModal.selectedUserId}
        selectedTransaction={donationModal.selectedTransaction}
        isSaving={donationModal.isSaving}
        onSave={donationModal.save}
        onClose={donationModal.close}
      />

      <DonationDeleteDialog
        transaction={donationDelete.deleteTarget}
        isOpen={donationDelete.isDeleteOpen}
        isDeleting={donationDelete.isDeleting}
        onConfirm={donationDelete.handleDeleteConfirm}
        onCancel={donationDelete.handleDeleteCancel}
      />
    </div>
  );
}
