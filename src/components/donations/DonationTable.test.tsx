import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DonationTable } from './DonationTable';
import type { Transaction, User, Activity, PaymentMethod } from '@/types';

const users: User[] = [
  { id: 1, civilityId: 1, lastName: 'Dupont', firstName: 'Jean', address: '', zip: '', city: '', amount: 0, phone: '', fax: '', email: '', memberNumber: 1, laoLastName: '' },
];

const activities: Activity[] = [
  { id: 1, description: 'Collecte 2024', startDate: '2024-01-01', endDate: '2024-12-31', estimation: 0, total: 0, expense: 0, checkTotal: 0, cashTotal: 0 },
];

const paymentMethods: PaymentMethod[] = [
  { id: 1, description: 'Chèque' },
];

const transactions: Transaction[] = [
  {
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
  },
  {
    id: 2,
    activityId: 1,
    userId: 1,
    date: '2024-06-20',
    amount: 50,
    paymentMethod: 1,
    notes: '',
    checkNumber: 0,
    bankName: '',
    bankCity: '',
  },
];

describe('DonationTable', () => {
  it('displays expected column headers', () => {
    render(
      <DonationTable
        transactions={transactions}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Montant')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each row', () => {
    render(
      <DonationTable
        transactions={transactions}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getAllByRole('button', { name: /modifier/i })).toHaveLength(transactions.length);
    expect(screen.getAllByRole('button', { name: /supprimer/i })).toHaveLength(transactions.length);
  });

  it('edit button calls onEdit with the correct transaction', () => {
    const onEdit = vi.fn();
    render(
      <DonationTable
        transactions={transactions}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getAllByRole('button', { name: /modifier/i })[0]);
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(transactions[0]);
  });

  it('delete button calls onDelete with the correct transaction', () => {
    const onDelete = vi.fn();
    render(
      <DonationTable
        transactions={transactions}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getAllByRole('button', { name: /supprimer/i })[0]);
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(transactions[0]);
  });

  it('formats the date as dd/mm/yyyy', () => {
    render(
      <DonationTable
        transactions={transactions}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('15/03/2024')).toBeInTheDocument();
  });

  it('formats the amount with 2 decimals and € symbol', () => {
    render(
      <DonationTable
        transactions={transactions}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText(/75,50\s*€/)).toBeInTheDocument();
  });

  it('resolves the user full name', () => {
    render(
      <DonationTable
        transactions={transactions}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getAllByText('Jean Dupont')).toHaveLength(transactions.length);
  });

  it('shows empty state when no transactions', () => {
    render(
      <DonationTable
        transactions={[]}
        users={users}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Aucun don trouvé')).toBeInTheDocument();
  });
});
