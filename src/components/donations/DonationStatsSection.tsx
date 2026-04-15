import type { DonationStats } from '@/hooks/useDonationStats';
import { DonationSummaryCards } from './DonationSummaryCards';
import { ActivityStatsTable } from './ActivityStatsTable';

interface DonationStatsSectionProps {
  stats: DonationStats;
}

export function DonationStatsSection({ stats }: DonationStatsSectionProps) {
  return (
    <details className="group">
      <summary className="cursor-pointer select-none list-none flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-3">
        <span className="transition-transform group-open:rotate-90">▶</span>
        Statistiques
      </summary>
      <div className="space-y-4">
        <DonationSummaryCards stats={stats} />
        {stats.byActivity.length > 0 && <ActivityStatsTable stats={stats} />}
      </div>
    </details>
  );
}
