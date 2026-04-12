import type { User, Activity, PaymentMethod, DonationFilters } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DonationFiltersProps {
  filters: DonationFilters;
  users: User[];
  activities: Activity[];
  paymentMethods: PaymentMethod[];
  onChange: (filters: DonationFilters) => void;
  onReset: () => void;
}

export function DonationFilters({
  filters,
  users,
  activities,
  paymentMethods,
  onChange,
  onReset,
}: DonationFiltersProps) {
  function handleUser(val: string) {
    onChange({ ...filters, userId: val ? Number(val) : undefined });
  }

  function handleActivity(val: string) {
    onChange({ ...filters, activityId: val ? Number(val) : undefined });
  }

  function handlePaymentMethod(val: string) {
    onChange({ ...filters, paymentMethodId: val ? Number(val) : undefined });
  }

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Utilisateur</label>
        <Select
          value={filters.userId !== undefined ? String(filters.userId) : ''}
          onValueChange={handleUser}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            {users.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.firstName} {u.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Activité</label>
        <Select
          value={filters.activityId !== undefined ? String(filters.activityId) : ''}
          onValueChange={handleActivity}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            {activities.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Mode de paiement</label>
        <Select
          value={filters.paymentMethodId !== undefined ? String(filters.paymentMethodId) : ''}
          onValueChange={handlePaymentMethod}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label htmlFor="dateFrom" className="text-xs text-muted-foreground">Du</label>
        <Input
          id="dateFrom"
          type="date"
          className="w-36"
          value={filters.dateFrom ?? ''}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || undefined })}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="dateTo" className="text-xs text-muted-foreground">Au</label>
        <Input
          id="dateTo"
          type="date"
          className="w-36"
          value={filters.dateTo ?? ''}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value || undefined })}
        />
      </div>

      <Button variant="outline" onClick={onReset}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
