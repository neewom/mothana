import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { DonationFilters, Transaction } from '@/types';
import { useDonations } from '@/hooks/useDonations';
import { useDonationModal } from '@/hooks/useDonationModal';
import { useDonationDelete } from '@/hooks/useDonationDelete';
import { DonationFilters as DonationFiltersComponent } from '@/components/donations/DonationFilters';
import { DonationTable } from '@/components/donations/DonationTable';
import { DonationForm } from '@/components/donations/DonationForm';
import { DonationDeleteDialog } from '@/components/donations/DonationDeleteDialog';
import { Button } from '@/components/ui/button';

const EMPTY_FILTERS: DonationFilters = {};

export function DonationsPage() {
  const { users, activities, paymentMethods, isLoading, error, filterDonations, reload } =
    useDonations();
  const [filters, setFilters] = useState<DonationFilters>(EMPTY_FILTERS);
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

  const filtered = filterDonations(filters);

  function handleSelect(transaction: Transaction) {
    console.log(transaction);
  }

  function handleEdit(transaction: Transaction) {
    isEditRef.current = true;
    donationModal.openEdit(transaction);
  }

  function handleOpenCreate() {
    isEditRef.current = false;
    donationModal.openCreate();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold">Dons</h1>
          {!isLoading && !error && (
            <span className="text-sm text-muted-foreground">
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Button onClick={handleOpenCreate}>Ajouter un don</Button>
      </div>

      <DonationFiltersComponent
        filters={filters}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {isLoading && (
        <div className="space-y-2" aria-label="Chargement">
          {Array.from({ length: 5 }).map((_, i) => (
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
        <DonationTable
          transactions={filtered}
          users={users}
          activities={activities}
          paymentMethods={paymentMethods}
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
