import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionTable } from './TransactionTable';
import type { Transaction, Activity, PaymentMethod } from '@/types';

const activities: Activity[] = [
  {
    id: 1,
    description: 'Don général',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    estimation: 1000,
    total: 500,
    expense: 50,
    checkTotal: 300,
    cashTotal: 200,
  },
  {
    id: 2,
    description: 'Parrainage enfant',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    estimation: 2000,
    total: 1500,
    expense: 100,
    checkTotal: 800,
    cashTotal: 700,
  },
];

const paymentMethods: PaymentMethod[] = [
  { id: 1, description: 'Chèque' },
  { id: 2, description: 'Espèces' },
];

const transactions: Transaction[] = [
  {
    id: 1,
    activityId: 1,
    userId: 1,
    date: '2024-01-15',
    amount: 50,
    paymentMethod: 1,
    notes: '',
    checkNumber: 1001,
    bankName: 'BNP',
    bankCity: 'Paris',
  },
  {
    id: 2,
    activityId: 2,
    userId: 1,
    date: '2024-03-10',
    amount: 100.5,
    paymentMethod: 2,
    notes: '',
    checkNumber: 0,
    bankName: '',
    bankCity: '',
  },
];

describe('TransactionTable', () => {
  it('renders the expected column headers', () => {
    render(
      <TransactionTable
        transactions={transactions}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Activité')).toBeInTheDocument();
    expect(screen.getByText('Montant')).toBeInTheDocument();
    expect(screen.getByText('Règlement')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.queryByText('N° reçu')).not.toBeInTheDocument();
  });

  it('renders edit and delete buttons for each row', () => {
    render(
      <TransactionTable
        transactions={transactions}
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
      <TransactionTable
        transactions={transactions}
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
      <TransactionTable
        transactions={transactions}
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

  it('formats date as dd/mm/yyyy', () => {
    render(
      <TransactionTable
        transactions={transactions}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    expect(screen.getByText('10/03/2024')).toBeInTheDocument();
  });

  it('formats amount with two decimal places and € symbol', () => {
    render(
      <TransactionTable
        transactions={transactions}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('50,00 €')).toBeInTheDocument();
    expect(screen.getByText('100,50 €')).toBeInTheDocument();
  });

  it('resolves activity and payment method labels', () => {
    render(
      <TransactionTable
        transactions={transactions}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Don général')).toBeInTheDocument();
    expect(screen.getByText('Parrainage enfant')).toBeInTheDocument();
    expect(screen.getByText('Chèque')).toBeInTheDocument();
    expect(screen.getByText('Espèces')).toBeInTheDocument();
  });

  it('displays empty state message when transaction list is empty', () => {
    render(
      <TransactionTable
        transactions={[]}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Aucun don enregistré pour cet utilisateur')).toBeInTheDocument();
  });

  it('calls onSelect with the correct transaction when a row is clicked', () => {
    const onSelect = vi.fn();
    render(
      <TransactionTable
        transactions={transactions}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={onSelect}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('15/01/2024'));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(transactions[0]);
  });

  it('does not call onSelect when table is empty', () => {
    const onSelect = vi.fn();
    render(
      <TransactionTable
        transactions={[]}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={onSelect}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(onSelect).not.toHaveBeenCalled();
  });
});
