import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { DonationFilters, Transaction } from '@/types';
import { useDonations } from '@/hooks/useDonations';
import { useDonationModal } from '@/hooks/useDonationModal';
import { useDonationDelete } from '@/hooks/useDonationDelete';
import { useDonationStats } from '@/hooks/useDonationStats';
import { DonationFilters as DonationFiltersComponent } from '@/components/donations/DonationFilters';
import { DonationTable } from '@/components/donations/DonationTable';
import { DonationDetail } from '@/components/donations/DonationDetail';
import { DonationForm } from '@/components/donations/DonationForm';
import { DonationDeleteDialog } from '@/components/donations/DonationDeleteDialog';
import { DonationStatsSection } from '@/components/donations/DonationStatsSection';
import { Button } from '@/components/ui/button';

const EMPTY_FILTERS: DonationFilters = {};

export function DonationsPage() {
  const { users, activities, paymentMethods, civilities, isLoading, error, filterDonations, reload } =
    useDonations();
  const [filters, setFilters] = useState<DonationFilters>(EMPTY_FILTERS);
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
      setSelectedTransactionId(undefined);
      reload();
      toast.success('Don supprimé');
    },
  });

  const filtered = filterDonations(filters);
  const selectedTransaction = selectedTransactionId !== undefined
    ? filtered.find((t) => t.id === selectedTransactionId)
    : undefined;
  const stats = useDonationStats(filtered, activities, paymentMethods);

  function handleSelect(transaction: Transaction) {
    setSelectedTransactionId(transaction.id);
  }

  function handleCloseDetail() {
    setSelectedTransactionId(undefined);
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

      {!isLoading && !error && <DonationStatsSection stats={stats} />}

      {!isLoading && !error && (
        <div className={selectedTransaction ? 'grid gap-4 lg:grid-cols-2' : undefined}>
          <DonationTable
            transactions={filtered}
            users={users}
            activities={activities}
            paymentMethods={paymentMethods}
            selectedTransactionId={selectedTransactionId}
            onSelect={handleSelect}
          />
          {selectedTransaction && (
            <DonationDetail
              transaction={selectedTransaction}
              users={users}
              activities={activities}
              paymentMethods={paymentMethods}
              civilities={civilities}
              onEdit={handleEdit}
              onDelete={(transaction) => donationDelete.confirmDelete(transaction)}
              onClose={handleCloseDetail}
            />
          )}
        </div>
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
