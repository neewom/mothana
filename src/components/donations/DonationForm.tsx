import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Activity, PaymentMethod, Transaction, User } from '@/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const schema = z.object({
  userId: z.number().min(1, 'Requis'),
  activityId: z.number().min(1, 'Requis'),
  date: z.string().min(1, 'Requis'),
  amount: z.number().positive('Doit être positif'),
  paymentMethod: z.number().min(1, 'Requis'),
  receiptId: z.string().max(10, 'Max 10 caractères'),
  receiptDate: z.string(),
  totalExpense: z.number().min(0),
  checkNumber: z.number().int().min(0).max(9999, 'Max 4 chiffres'),
  bankName: z.string().max(20, 'Max 20 caractères'),
  bankCity: z.string().max(20, 'Max 20 caractères'),
  checkDate: z.string(),
  notes: z.string().max(50, 'Max 50 caractères'),
});

type FormValues = z.infer<typeof schema>;

const CHECK_LABEL = 'Chèque';

interface DonationFormProps {
  users: User[];
  activities: Activity[];
  paymentMethods: PaymentMethod[];
  defaultUserId?: number;
  isSaving: boolean;
  onSave: (data: Omit<Transaction, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function DonationForm({
  users,
  activities,
  paymentMethods,
  defaultUserId,
  isSaving,
  onSave,
  onCancel,
}: DonationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: defaultUserId ?? 0,
      activityId: 0,
      date: '',
      amount: 0,
      paymentMethod: 0,
      receiptId: '',
      receiptDate: '',
      totalExpense: 0,
      checkNumber: 0,
      bankName: '',
      bankCity: '',
      checkDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (defaultUserId !== undefined) {
      setValue('userId', defaultUserId);
    }
  }, [defaultUserId, setValue]);

  const selectedPaymentMethodId = watch('paymentMethod');
  const selectedPaymentMethod = paymentMethods.find((p) => p.id === selectedPaymentMethodId);
  const isCheck = selectedPaymentMethod?.description === CHECK_LABEL;

  async function onSubmit(values: FormValues) {
    await onSave(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Utilisateur */}
      <div className="space-y-1">
        <label htmlFor="userId" className="text-sm font-medium">Utilisateur *</label>
        <Select
          value={watch('userId') > 0 ? String(watch('userId')) : ''}
          onValueChange={(val: string) => setValue('userId', Number(val), { shouldValidate: true })}
          disabled={defaultUserId !== undefined}
        >
          <SelectTrigger id="userId" className="w-full">
            <SelectValue placeholder="Sélectionner…" />
          </SelectTrigger>
          <SelectContent>
            {users.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.firstName} {u.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.userId && <p className="text-sm text-destructive">{errors.userId.message}</p>}
      </div>

      {/* Activité */}
      <div className="space-y-1">
        <label htmlFor="activityId" className="text-sm font-medium">Activité *</label>
        <Select
          value={watch('activityId') > 0 ? String(watch('activityId')) : ''}
          onValueChange={(val: string) => setValue('activityId', Number(val), { shouldValidate: true })}
        >
          <SelectTrigger id="activityId" className="w-full">
            <SelectValue placeholder="Sélectionner…" />
          </SelectTrigger>
          <SelectContent>
            {activities.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.activityId && <p className="text-sm text-destructive">{errors.activityId.message}</p>}
      </div>

      {/* Date / Montant */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="date" className="text-sm font-medium">Date *</label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="amount" className="text-sm font-medium">Montant *</label>
          <Input id="amount" type="number" min={0} step="0.01" {...register('amount', { valueAsNumber: true })} />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
        </div>
      </div>

      {/* Mode de paiement */}
      <div className="space-y-1">
        <label htmlFor="paymentMethod" className="text-sm font-medium">Mode de paiement *</label>
        <Select
          value={watch('paymentMethod') > 0 ? String(watch('paymentMethod')) : ''}
          onValueChange={(val: string) => setValue('paymentMethod', Number(val), { shouldValidate: true })}
        >
          <SelectTrigger id="paymentMethod" className="w-full">
            <SelectValue placeholder="Sélectionner…" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>}
      </div>

      {/* Champs chèque (conditionnels) */}
      {isCheck && (
        <div className="space-y-4 rounded-lg border p-4">
          <p className="text-sm font-medium text-muted-foreground">Informations chèque</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="checkNumber" className="text-sm font-medium">N° chèque</label>
              <Input id="checkNumber" type="number" min={0} max={9999} {...register('checkNumber', { valueAsNumber: true })} />
              {errors.checkNumber && <p className="text-sm text-destructive">{errors.checkNumber.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="checkDate" className="text-sm font-medium">Date du chèque</label>
              <Input id="checkDate" type="date" {...register('checkDate')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="bankName" className="text-sm font-medium">Banque</label>
              <Input id="bankName" {...register('bankName')} />
              {errors.bankName && <p className="text-sm text-destructive">{errors.bankName.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="bankCity" className="text-sm font-medium">Ville banque</label>
              <Input id="bankCity" {...register('bankCity')} />
              {errors.bankCity && <p className="text-sm text-destructive">{errors.bankCity.message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Reçu */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="receiptId" className="text-sm font-medium">N° de reçu</label>
          <Input id="receiptId" {...register('receiptId')} />
          {errors.receiptId && <p className="text-sm text-destructive">{errors.receiptId.message}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="receiptDate" className="text-sm font-medium">Date reçu</label>
          <Input id="receiptDate" type="date" {...register('receiptDate')} />
        </div>
      </div>

      {/* Dépense totale */}
      <div className="space-y-1">
        <label htmlFor="totalExpense" className="text-sm font-medium">Dépense totale</label>
        <Input id="totalExpense" type="number" min={0} step="0.01" {...register('totalExpense', { valueAsNumber: true })} />
        {errors.totalExpense && <p className="text-sm text-destructive">{errors.totalExpense.message}</p>}
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="h-auto w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        />
        {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
