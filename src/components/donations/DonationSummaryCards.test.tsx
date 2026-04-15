import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DonationSummaryCards } from './DonationSummaryCards';
import type { DonationStats } from '@/hooks/useDonationStats';

const stats: DonationStats = {
  totalCount: 12,
  totalAmount: 1500.5,
  averageAmount: 125.04166,
  byActivity: [],
};

describe('DonationSummaryCards', () => {
  it('renders three cards', () => {
    render(<DonationSummaryCards stats={stats} />);
    expect(screen.getByText('Nombre de dons')).toBeInTheDocument();
    expect(screen.getByText('Total collecté')).toBeInTheDocument();
    expect(screen.getByText('Don moyen')).toBeInTheDocument();
  });

  it('displays the correct totalCount', () => {
    render(<DonationSummaryCards stats={stats} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('displays the totalAmount formatted in French locale', () => {
    render(<DonationSummaryCards stats={stats} />);
    expect(screen.getByText(/1\s*500,50\s*€/)).toBeInTheDocument();
  });

  it('displays the averageAmount formatted with 2 decimal places', () => {
    render(<DonationSummaryCards stats={stats} />);
    expect(screen.getByText(/125,04\s*€/)).toBeInTheDocument();
  });

  it('displays 0,00 € amounts when stats are zero', () => {
    const zeroStats: DonationStats = { totalCount: 0, totalAmount: 0, averageAmount: 0, byActivity: [] };
    render(<DonationSummaryCards stats={zeroStats} />);
    const zeros = screen.getAllByText(/0,00\s*€/);
    expect(zeros).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
