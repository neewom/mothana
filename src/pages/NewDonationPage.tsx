import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';
import type { User, Activity, PaymentMethod } from '@/types';
import { userService } from '@/services/userService';
import { activityService } from '@/services/activityService';
import { paymentMethodService } from '@/services/paymentMethodService';
import { useDonationForm } from '@/hooks/useDonationForm';
import { DonationForm } from '@/components/donations/DonationForm';
import { Button } from '@/components/ui/button';

export function NewDonationPage() {
  const navigate = useNavigate();
  const { defaultUserId, isSaving, save } = useDonationForm();

  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    Promise.all([
      userService.getAll(),
      activityService.getAll(),
      paymentMethodService.getAll(),
    ]).then(([us, acts, methods]) => {
      setUsers(us);
      setActivities(acts);
      setPaymentMethods(methods);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate('/donations')}
          aria-label="Retour aux dons"
        >
          <ChevronLeftIcon />
        </Button>
        <h1 className="text-2xl font-semibold">Nouveau don</h1>
      </div>

      <div className="max-w-lg">
        <DonationForm
          users={users}
          activities={activities}
          paymentMethods={paymentMethods}
          defaultUserId={defaultUserId}
          isSaving={isSaving}
          onSave={save}
          onCancel={() => navigate('/donations')}
        />
      </div>
    </div>
  );
}
