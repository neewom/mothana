import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DonationDeleteDialog } from './DonationDeleteDialog';
import type { Transaction } from '@/types';

const transaction: Transaction = {
  id: 1,
  activityId: 1,
  userId: 1,
  date: '2024-03-15',
  amount: 75.5,
  paymentMethod: 1,
  notes: '',
  checkNumber: 0,
  bankName: '',
  bankCity: '',
};

describe('DonationDeleteDialog', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <DonationDeleteDialog
        transaction={transaction}
        isOpen={false}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByText('Confirmer la suppression')).not.toBeInTheDocument();
  });

  it('displays the formatted date in the confirmation message', () => {
    render(
      <DonationDeleteDialog
        transaction={transaction}
        isOpen={true}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByText(/15\/03\/2024/)).toBeInTheDocument();
  });

  it('displays the formatted amount in the confirmation message', () => {
    render(
      <DonationDeleteDialog
        transaction={transaction}
        isOpen={true}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByText(/75,50\s*€/)).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <DonationDeleteDialog
        transaction={transaction}
        isOpen={true}
        isDeleting={false}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <DonationDeleteDialog
        transaction={transaction}
        isOpen={true}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('disables buttons while deleting', () => {
    render(
      <DonationDeleteDialog
        transaction={transaction}
        isOpen={true}
        isDeleting={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /suppression/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /annuler/i })).toBeDisabled();
  });
});
