import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DonationForm } from './DonationForm';
import type { Transaction } from '@/types';

vi.mock('@/services/userService', () => ({
  userService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 1, civilityId: 1, lastName: 'Dupont', firstName: 'Jean', address: '', zip: '', city: '', amount: 0, phone: '', fax: '', email: '', memberNumber: 1, laoLastName: '' },
      { id: 2, civilityId: 2, lastName: 'Martin', firstName: 'Sophie', address: '', zip: '', city: '', amount: 0, phone: '', fax: '', email: '', memberNumber: 2, laoLastName: '' },
    ]),
  },
}));

vi.mock('@/services/activityService', () => ({
  activityService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 1, description: 'Collecte 2024', startDate: '2024-01-01', endDate: '2024-12-31', estimation: 0, total: 0, expense: 0, checkTotal: 0, cashTotal: 0 },
    ]),
  },
}));

vi.mock('@/services/paymentMethodService', () => ({
  paymentMethodService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 1, description: 'Chèque' },
      { id: 2, description: 'Espèces' },
    ]),
  },
}));

const existingTransaction: Transaction = {
  id: 5,
  userId: 1,
  activityId: 1,
  date: '2024-06-15',
  amount: 120,
  paymentMethod: 2,
  notes: 'Note de test',
  checkNumber: 0,
  bankName: '',
  bankCity: '',
};

const defaultProps = {
  isOpen: true,
  selectedUserId: null,
  selectedTransaction: null,
  isSaving: false,
  onSave: vi.fn(),
  onClose: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DonationForm', () => {
  it('displays "Nouveau don" in create mode', async () => {
    render(<DonationForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Nouveau don')).toBeInTheDocument();
    });
  });

  it('displays "Modifier le don" in edit mode', async () => {
    render(<DonationForm {...defaultProps} selectedTransaction={existingTransaction} />);
    await waitFor(() => {
      expect(screen.getByText('Modifier le don')).toBeInTheDocument();
    });
  });

  it('does not render modal content when isOpen is false', () => {
    render(<DonationForm {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Nouveau don')).not.toBeInTheDocument();
  });

  it('user select is disabled when selectedUserId is provided', async () => {
    render(<DonationForm {...defaultProps} selectedUserId={1} />);
    await waitFor(() => {
      const triggers = screen.getAllByRole('combobox');
      expect(triggers[0]).toHaveAttribute('disabled');
    });
  });

  it('user select is disabled in edit mode', async () => {
    render(<DonationForm {...defaultProps} selectedTransaction={existingTransaction} />);
    await waitFor(() => {
      const triggers = screen.getAllByRole('combobox');
      expect(triggers[0]).toHaveAttribute('disabled');
    });
  });

  it('user select is enabled when selectedUserId is null and no selectedTransaction', async () => {
    render(<DonationForm {...defaultProps} selectedUserId={null} selectedTransaction={null} />);
    await waitFor(() => {
      const triggers = screen.getAllByRole('combobox');
      expect(triggers[0]).not.toHaveAttribute('disabled');
    });
  });

  it('does not show check fields by default', async () => {
    render(<DonationForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Nouveau don')).toBeInTheDocument();
    });
    expect(screen.queryByLabelText(/n° chèque/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^Banque$/i)).not.toBeInTheDocument();
  });

  it('submit button is disabled when form is empty', async () => {
    render(<DonationForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enregistrer/i })).toBeDisabled();
    });
  });

  it('submit button is disabled while saving', async () => {
    render(<DonationForm {...defaultProps} isSaving={true} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enregistrement/i })).toBeDisabled();
    });
  });

  it('calls onClose when Annuler button is clicked', async () => {
    render(<DonationForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
    });
    screen.getByRole('button', { name: /annuler/i }).click();
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  it('shows "Supprimer ce don" button in edit mode when onDelete is provided', async () => {
    const onDelete = vi.fn();
    render(
      <DonationForm
        {...defaultProps}
        selectedTransaction={existingTransaction}
        onDelete={onDelete}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /supprimer ce don/i })).toBeInTheDocument();
    });
  });

  it('does not show "Supprimer ce don" button in create mode', async () => {
    const onDelete = vi.fn();
    render(<DonationForm {...defaultProps} onDelete={onDelete} />);
    await waitFor(() => {
      expect(screen.getByText('Nouveau don')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /supprimer ce don/i })).not.toBeInTheDocument();
  });

  it('"Supprimer ce don" button calls onDelete when clicked', async () => {
    const onDelete = vi.fn();
    render(
      <DonationForm
        {...defaultProps}
        selectedTransaction={existingTransaction}
        onDelete={onDelete}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /supprimer ce don/i })).toBeInTheDocument();
    });
    screen.getByRole('button', { name: /supprimer ce don/i }).click();
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
