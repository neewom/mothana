import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityStatsTable } from './ActivityStatsTable';
import type { DonationStats, ActivityStats } from '@/hooks/useDonationStats';
import type { Activity } from '@/types';

function makeActivity(id: number, description: string): Activity {
  return { id, description, startDate: '2024-01-01', endDate: '2024-12-31', estimation: 0, total: 0, expense: 0, checkTotal: 0, cashTotal: 0 };
}

const byActivity: ActivityStats[] = [
  { activity: makeActivity(2, 'Parrainage 2024'), count: 2, totalAmount: 275, checkTotal: 200, cashTotal: 0 },
  { activity: makeActivity(1, 'Collecte 2024'), count: 2, totalAmount: 150, checkTotal: 100, cashTotal: 50 },
];

const stats: DonationStats = {
  totalCount: 4,
  totalAmount: 425,
  averageAmount: 106.25,
  byActivity,
};

const emptyStats: DonationStats = {
  totalCount: 0,
  totalAmount: 0,
  averageAmount: 0,
  byActivity: [],
};

describe('ActivityStatsTable', () => {
  it('renders a row per activity', () => {
    render(<ActivityStatsTable stats={stats} />);
    expect(screen.getByText('Parrainage 2024')).toBeInTheDocument();
    expect(screen.getByText('Collecte 2024')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<ActivityStatsTable stats={stats} />);
    expect(screen.getByRole('columnheader', { name: 'Activité' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Dons' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Chèques' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Espèces' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Total' })).toBeInTheDocument();
  });

  it('renders the total row with correct totals', () => {
    render(<ActivityStatsTable stats={stats} />);
    const rows = screen.getAllByRole('row');
    const totalRow = rows[rows.length - 1];
    expect(totalRow).toHaveTextContent('4');
    expect(totalRow.textContent).toMatch(/425,00\s*€/);
  });

  it('renders correct count for each activity', () => {
    render(<ActivityStatsTable stats={stats} />);
    const cells = screen.getAllByRole('cell');
    const countCells = cells.filter((c) => c.textContent === '2');
    expect(countCells.length).toBeGreaterThanOrEqual(2);
  });

  it('does not render the total row when byActivity is empty', () => {
    render(<ActivityStatsTable stats={emptyStats} />);
    // Only the column header "Total" should exist — no summary row cell
    const totals = screen.getAllByText('Total');
    expect(totals).toHaveLength(1);
    expect(totals[0].tagName.toLowerCase()).toBe('th');
  });

  it('displays check and cash totals per activity', () => {
    render(<ActivityStatsTable stats={stats} />);
    expect(screen.getAllByText(/200,00\s*€/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/50,00\s*€/).length).toBeGreaterThanOrEqual(1);
  });
});
