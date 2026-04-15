import type { DonationStats } from '@/hooks/useDonationStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DonationSummaryCardsProps {
  stats: DonationStats;
}

function formatAmount(amount: number): string {
  return (
    amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
  );
}

export function DonationSummaryCards({ stats }: DonationSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Nombre de dons</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{stats.totalCount}</p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Total collecté</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatAmount(stats.totalAmount)}</p>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Don moyen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatAmount(stats.averageAmount)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
