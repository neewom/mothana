import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DonationForm } from './DonationForm';

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

const defaultProps = {
  isOpen: true,
  selectedUserId: null,
  isSaving: false,
  onSave: vi.fn(),
  onClose: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DonationForm', () => {
  it('renders modal content when isOpen is true', async () => {
    render(<DonationForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Nouveau don')).toBeInTheDocument();
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

  it('user select is enabled when selectedUserId is null', async () => {
    render(<DonationForm {...defaultProps} selectedUserId={null} />);
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

  it('shows check fields when Chèque payment method is selected', async () => {
    render(<DonationForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(3);
    });
    // paymentMethod trigger is the 3rd combobox (userId, activityId, paymentMethod)
    const triggers = screen.getAllByRole('combobox');
    const paymentTrigger = triggers[2];
    fireEvent.click(paymentTrigger);
    await waitFor(() => {
      const option = screen.getByRole('option', { name: 'Chèque' });
      fireEvent.click(option);
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/n° chèque/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Banque$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ville banque/i)).toBeInTheDocument();
    });
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
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });
});
