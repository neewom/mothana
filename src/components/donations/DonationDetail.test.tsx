import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DonationDetail } from './DonationDetail';
import type { Transaction, User, Activity, PaymentMethod, Civility } from '@/types';

const civilities: Civility[] = [
  { id: 1, description: 'M.' },
  { id: 2, description: 'Mme' },
];

const users: User[] = [
  {
    id: 1,
    civilityId: 1,
    lastName: 'Dupont',
    firstName: 'Jean',
    address: '',
    zip: '',
    city: '',
    amount: 0,
    phone: '',
    fax: '',
    email: '',
    memberNumber: 1,
    laoLastName: '',
  },
];

const activities: Activity[] = [
  {
    id: 1,
    description: 'Collecte 2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    estimation: 0,
    total: 0,
    expense: 0,
    checkTotal: 0,
    cashTotal: 0,
  },
];

const paymentMethods: PaymentMethod[] = [
  { id: 1, description: 'Chèque' },
  { id: 2, description: 'Espèces' },
];

const chequeTransaction: Transaction = {
  id: 1,
  activityId: 1,
  userId: 1,
  date: '2024-03-15',
  amount: 75.5,
  paymentMethod: 1,
  notes: '',
  checkNumber: 1234,
  bankName: 'BNP Paribas',
  bankCity: 'Paris',
};

const especesTransaction: Transaction = {
  id: 2,
  activityId: 1,
  userId: 1,
  date: '2024-06-20',
  amount: 50,
  paymentMethod: 2,
  notes: 'Don régulier',
  checkNumber: 0,
  bankName: '',
  bankCity: '',
};

const defaultProps = {
  users,
  activities,
  paymentMethods,
  civilities,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onClose: vi.fn(),
};

describe('DonationDetail', () => {
  it('displays the resolved full user name with civility', () => {
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} />);
    expect(screen.getByText('M. Jean Dupont')).toBeInTheDocument();
  });

  it('displays the date formatted as dd/mm/yyyy', () => {
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} />);
    expect(screen.getByText('15/03/2024')).toBeInTheDocument();
  });

  it('displays the resolved activity label', () => {
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} />);
    expect(screen.getByText('Collecte 2024')).toBeInTheDocument();
  });

  it('displays the formatted amount', () => {
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} />);
    expect(screen.getByText(/75,50\s*€/)).toBeInTheDocument();
  });

  it('displays the resolved payment method label', () => {
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} />);
    expect(screen.getByText('Chèque')).toBeInTheDocument();
  });

  it('shows check details when payment method is Chèque', () => {
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} />);
    expect(screen.getByText('Informations chèque')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('BNP Paribas')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('does not show check details when payment method is not Chèque', () => {
    render(<DonationDetail {...defaultProps} transaction={especesTransaction} />);
    expect(screen.queryByText('Informations chèque')).not.toBeInTheDocument();
    expect(screen.queryByText('N° chèque')).not.toBeInTheDocument();
  });

  it('does not show notes when notes are empty', () => {
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} />);
    expect(screen.queryByText('Notes')).not.toBeInTheDocument();
  });

  it('shows notes when notes are non-empty', () => {
    render(<DonationDetail {...defaultProps} transaction={especesTransaction} />);
    expect(screen.getByText('Don régulier')).toBeInTheDocument();
  });

  it('edit button calls onEdit with the correct transaction', () => {
    const onEdit = vi.fn();
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /modifier/i }));
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(chequeTransaction);
  });

  it('delete button calls onDelete with the correct transaction', () => {
    const onDelete = vi.fn();
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(chequeTransaction);
  });

  it('close button calls onClose', () => {
    const onClose = vi.fn();
    render(<DonationDetail {...defaultProps} transaction={chequeTransaction} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /fermer le panneau/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
