import type { DonationStats } from '@/hooks/useDonationStats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ActivityStatsTableProps {
  stats: DonationStats;
}

function formatAmount(amount: number): string {
  return (
    amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
  );
}

export function ActivityStatsTable({ stats }: ActivityStatsTableProps) {
  const totalCheckTotal = stats.byActivity.reduce((sum, s) => sum + s.checkTotal, 0);
  const totalCashTotal = stats.byActivity.reduce((sum, s) => sum + s.cashTotal, 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Activité</TableHead>
          <TableHead className="text-right">Dons</TableHead>
          <TableHead className="text-right hidden sm:table-cell">Chèques</TableHead>
          <TableHead className="text-right hidden sm:table-cell">Espèces</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.byActivity.map((activityStats) => (
          <TableRow key={activityStats.activity.id}>
            <TableCell>{activityStats.activity.description}</TableCell>
            <TableCell className="text-right">{activityStats.count}</TableCell>
            <TableCell className="text-right hidden sm:table-cell">
              {formatAmount(activityStats.checkTotal)}
            </TableCell>
            <TableCell className="text-right hidden sm:table-cell">
              {formatAmount(activityStats.cashTotal)}
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatAmount(activityStats.totalAmount)}
            </TableCell>
          </TableRow>
        ))}
        {stats.byActivity.length > 0 && (
          <TableRow className="font-semibold border-t-2">
            <TableCell>Total</TableCell>
            <TableCell className="text-right">{stats.totalCount}</TableCell>
            <TableCell className="text-right hidden sm:table-cell">
              {formatAmount(totalCheckTotal)}
            </TableCell>
            <TableCell className="text-right hidden sm:table-cell">
              {formatAmount(totalCashTotal)}
            </TableCell>
            <TableCell className="text-right">{formatAmount(stats.totalAmount)}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
