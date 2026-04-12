import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserDeleteDialog } from './UserDeleteDialog';
import type { User } from '@/types';

const user: User = {
  id: 1,
  civilityId: 1,
  lastName: 'Dupont',
  firstName: 'Jean',
  address: '',
  zip: '',
  city: '',
  email: '',
  phone: '',
  fax: '',
  memberNumber: 0,
  laoLastName: '',
  amount: 0,
};

describe('UserDeleteDialog', () => {
  it('renders user name in confirmation message when open', () => {
    render(
      <UserDeleteDialog
        user={user}
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument();
  });

  it('does not render dialog content when closed', () => {
    render(
      <UserDeleteDialog
        user={null}
        isOpen={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByText('Confirmer la suppression')).not.toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <UserDeleteDialog
        user={user}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <UserDeleteDialog
        user={user}
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('disables buttons and shows deleting state while deleting', () => {
    render(
      <UserDeleteDialog
        user={user}
        isOpen={true}
        isDeleting={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeDisabled();
    expect(screen.getByText('Suppression…')).toBeInTheDocument();
  });
});
