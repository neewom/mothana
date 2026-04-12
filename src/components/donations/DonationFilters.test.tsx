import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DonationFilters } from './DonationFilters';
import type { User, Activity, PaymentMethod, DonationFilters as DFType } from '@/types';

const users: User[] = [
  { id: 1, civilityId: 1, lastName: 'Dupont', firstName: 'Jean', address: '', zip: '', city: '', amount: 0, phone: '', fax: '', email: '', memberNumber: 1, laoLastName: '' },
];

const activities: Activity[] = [
  { id: 1, description: 'Collecte 2024', startDate: '2024-01-01', endDate: '2024-12-31', estimation: 0, total: 0, expense: 0, checkTotal: 0, cashTotal: 0 },
];

const paymentMethods: PaymentMethod[] = [
  { id: 1, description: 'Chèque' },
  { id: 2, description: 'Espèces' },
];

const defaultFilters: DFType = {};

function renderFilters(overrides?: Partial<Parameters<typeof DonationFilters>[0]>) {
  const onChange = vi.fn();
  const onReset = vi.fn();
  render(
    <DonationFilters
      filters={defaultFilters}
      users={users}
      activities={activities}
      paymentMethods={paymentMethods}
      onChange={onChange}
      onReset={onReset}
      {...overrides}
    />
  );
  return { onChange, onReset };
}

describe('DonationFilters', () => {
  it('displays the reset button', () => {
    renderFilters();
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument();
  });

  it('displays date inputs', () => {
    renderFilters();
    expect(screen.getByLabelText(/^Du$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Au$/i)).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', () => {
    const { onReset } = renderFilters();
    fireEvent.click(screen.getByRole('button', { name: /réinitialiser/i }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('calls onChange with dateFrom when date input changes', () => {
    const { onChange } = renderFilters();
    fireEvent.change(screen.getByLabelText(/^Du$/i), { target: { value: '2024-01-01' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ dateFrom: '2024-01-01' }));
  });

  it('calls onChange with dateTo when date input changes', () => {
    const { onChange } = renderFilters();
    fireEvent.change(screen.getByLabelText(/^Au$/i), { target: { value: '2024-12-31' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ dateTo: '2024-12-31' }));
  });
});
