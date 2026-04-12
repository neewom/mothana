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
    totalExpense: 0,
    receiptDate: '2024-01-20',
    paymentMethod: 1,
    receiptId: 'R2024-001',
    notes: '',
    checkNumber: 1001,
    bankName: 'BNP',
    bankCity: 'Paris',
    checkDate: '2024-01-14',
  },
  {
    id: 2,
    activityId: 2,
    userId: 1,
    date: '2024-03-10',
    amount: 100.5,
    totalExpense: 0,
    receiptDate: '2024-03-15',
    paymentMethod: 2,
    receiptId: 'R2024-002',
    notes: '',
    checkNumber: 0,
    bankName: '',
    bankCity: '',
    checkDate: '',
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
      />,
    );
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Activité')).toBeInTheDocument();
    expect(screen.getByText('Montant')).toBeInTheDocument();
    expect(screen.getByText('Règlement')).toBeInTheDocument();
    expect(screen.getByText('N° reçu')).toBeInTheDocument();
  });

  it('formats date as dd/mm/yyyy', () => {
    render(
      <TransactionTable
        transactions={transactions}
        activities={activities}
        paymentMethods={paymentMethods}
        onSelect={vi.fn()}
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
      />,
    );
    fireEvent.click(screen.getByText('R2024-001'));
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
      />,
    );
    expect(onSelect).not.toHaveBeenCalled();
  });
});
