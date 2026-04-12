import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User, Civility } from '@/types';
import { civilityService } from '@/services/civilityService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  civilityId: z.number().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis').max(30, 'Max 30 caractères'),
  firstName: z.string().min(1, 'Requis').max(30, 'Max 30 caractères'),
  address: z.string().max(35, 'Max 35 caractères'),
  zip: z.string().max(5, 'Max 5 caractères'),
  city: z.string().max(30, 'Max 30 caractères'),
  email: z
    .string()
    .max(50, 'Max 50 caractères')
    .refine(
      (val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: 'Format email invalide' },
    ),
  phone: z.string().max(20, 'Max 20 caractères'),
  fax: z.string().max(20, 'Max 20 caractères'),
  memberNumber: z.number().int().min(0).max(99, 'Max 2 chiffres'),
  laoLastName: z.string().max(50, 'Max 50 caractères'),
  amount: z.number().min(0, 'Doit être positif'),
});

type FormValues = z.infer<typeof schema>;

interface UserFormProps {
  isOpen: boolean;
  selectedUser: User | null;
  isSaving: boolean;
  onSave: (data: Omit<User, 'id'>) => Promise<void>;
  onClose: () => void;
}

export function UserForm({ isOpen, selectedUser, isSaving, onSave, onClose }: UserFormProps) {
  const [civilities, setCivilities] = useState<Civility[]>([]);
  const isEditMode = selectedUser !== null;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      civilityId: 0,
      lastName: '',
      firstName: '',
      address: '',
      zip: '',
      city: '',
      email: '',
      phone: '',
      fax: '',
      memberNumber: 0,
      laoLastName: '',
      amount: 0,
    },
  });

  useEffect(() => {
    civilityService.getAll().then(setCivilities).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      if (selectedUser) {
        reset({
          civilityId: selectedUser.civilityId,
          lastName: selectedUser.lastName,
          firstName: selectedUser.firstName,
          address: selectedUser.address,
          zip: selectedUser.zip,
          city: selectedUser.city,
          email: selectedUser.email,
          phone: selectedUser.phone,
          fax: selectedUser.fax,
          memberNumber: selectedUser.memberNumber,
          laoLastName: selectedUser.laoLastName,
          amount: selectedUser.amount,
        });
      } else {
        reset({
          civilityId: 0,
          lastName: '',
          firstName: '',
          address: '',
          zip: '',
          city: '',
          email: '',
          phone: '',
          fax: '',
          memberNumber: 0,
          laoLastName: '',
          amount: 0,
        });
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [isOpen, selectedUser, reset]);

  async function onSubmit(values: FormValues) {
    await onSave(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Civilité */}
          <div className="space-y-1">
            <label htmlFor="civilityId" className="text-sm font-medium">Civilité *</label>
            <Select
              value={watch('civilityId') > 0 ? String(watch('civilityId')) : ''}
              onValueChange={(val: string | null) => setValue('civilityId', Number(val ?? 0), { shouldValidate: true })}
            >
              <SelectTrigger id="civilityId">
                <SelectValue placeholder="Sélectionner…" />
              </SelectTrigger>
              <SelectContent>
                {civilities.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.civilityId && <p className="text-sm text-destructive">{errors.civilityId.message}</p>}
          </div>

          {/* Nom / Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="lastName" className="text-sm font-medium">Nom *</label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-sm font-medium">Prénom *</label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-1">
            <label htmlFor="address" className="text-sm font-medium">Adresse</label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          {/* CP / Ville */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="zip" className="text-sm font-medium">Code postal</label>
              <Input id="zip" {...register('zip')} />
              {errors.zip && <p className="text-sm text-destructive">{errors.zip.message}</p>}
            </div>
            <div className="space-y-1 col-span-2">
              <label htmlFor="city" className="text-sm font-medium">Ville</label>
              <Input id="city" {...register('city')} />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* Téléphone / Fax */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="fax" className="text-sm font-medium">Fax</label>
              <Input id="fax" {...register('fax')} />
              {errors.fax && <p className="text-sm text-destructive">{errors.fax.message}</p>}
            </div>
          </div>

          {/* N° adhérent / Montant */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="memberNumber" className="text-sm font-medium">N° adhérent</label>
              <Input id="memberNumber" type="number" min={0} max={99} {...register('memberNumber', { valueAsNumber: true })} />
              {errors.memberNumber && <p className="text-sm text-destructive">{errors.memberNumber.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="amount" className="text-sm font-medium">Montant</label>
              <Input id="amount" type="number" min={0} step="0.01" {...register('amount', { valueAsNumber: true })} />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
          </div>

          {/* Nom lao */}
          <div className="space-y-1">
            <label htmlFor="laoLastName" className="text-sm font-medium">Nom en lao</label>
            <Input id="laoLastName" {...register('laoLastName')} />
            {errors.laoLastName && <p className="text-sm text-destructive">{errors.laoLastName.message}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Enregistrement…' : isEditMode ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
