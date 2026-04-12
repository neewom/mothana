import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DonationForm } from './DonationForm';
import type { User, Activity, PaymentMethod } from '@/types';

const users: User[] = [
  { id: 1, civilityId: 1, lastName: 'Dupont', firstName: 'Jean', address: '', zip: '', city: '', amount: 0, phone: '', fax: '', email: '', memberNumber: 1, laoLastName: '' },
  { id: 2, civilityId: 2, lastName: 'Martin', firstName: 'Sophie', address: '', zip: '', city: '', amount: 0, phone: '', fax: '', email: '', memberNumber: 2, laoLastName: '' },
];

const activities: Activity[] = [
  { id: 1, description: 'Collecte 2024', startDate: '2024-01-01', endDate: '2024-12-31', estimation: 0, total: 0, expense: 0, checkTotal: 0, cashTotal: 0 },
];

const paymentMethods: PaymentMethod[] = [
  { id: 1, description: 'Chèque' },
  { id: 2, description: 'Espèces' },
];

const defaultProps = {
  users,
  activities,
  paymentMethods,
  isSaving: false,
  onSave: vi.fn(),
  onCancel: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DonationForm', () => {
  it('renders all required fields', () => {
    render(<DonationForm {...defaultProps} />);
    expect(screen.getByLabelText(/utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/activité/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Date \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/montant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mode de paiement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('does not show check fields when payment method is not Chèque', () => {
    render(<DonationForm {...defaultProps} />);
    expect(screen.queryByLabelText(/n° chèque/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/banque/i)).not.toBeInTheDocument();
  });

  it('shows check fields when Chèque payment method is selected', async () => {
    render(<DonationForm {...defaultProps} />);
    // Simulate selecting Chèque (id=1) via the hidden select input
    const triggers = screen.getAllByRole('combobox');
    // paymentMethod trigger is the 3rd one (userId, activityId, paymentMethod)
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

  it('pre-fills and disables the user field when defaultUserId is provided', () => {
    render(<DonationForm {...defaultProps} defaultUserId={1} />);
    const trigger = screen.getAllByRole('combobox')[0];
    expect(trigger).toHaveAttribute('disabled');
  });

  it('shows validation errors when submitting empty required fields', async () => {
    render(<DonationForm {...defaultProps} />);
    // Submit the form directly (button is disabled when invalid)
    fireEvent.submit(document.querySelector('form')!);
    await waitFor(() => {
      expect(screen.getAllByText('Requis').length).toBeGreaterThan(0);
    });
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button clicked', () => {
    render(<DonationForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(defaultProps.onCancel).toHaveBeenCalledOnce();
  });

  it('submit button is disabled when form is empty', () => {
    render(<DonationForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: /enregistrer/i })).toBeDisabled();
  });

  it('submit button is disabled while saving', () => {
    render(<DonationForm {...defaultProps} isSaving={true} />);
    expect(screen.getByRole('button', { name: /enregistrement/i })).toBeDisabled();
  });
});
