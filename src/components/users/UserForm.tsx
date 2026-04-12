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
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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
    if (isOpen) {
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
    }
  }, [isOpen, selectedUser, reset]);

  async function onSubmit(values: FormValues) {
    await onSave(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Civilité */}
          <FormItem>
            <FormLabel htmlFor="civilityId">Civilité *</FormLabel>
            <Select
              onValueChange={(val) => setValue('civilityId', Number(val), { shouldValidate: true })}
              defaultValue={selectedUser ? String(selectedUser.civilityId) : undefined}
              key={isOpen ? String(selectedUser?.civilityId ?? 'new') : 'closed'}
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
            <FormMessage>{errors.civilityId?.message}</FormMessage>
          </FormItem>

          {/* Nom / Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel htmlFor="lastName">Nom *</FormLabel>
              <Input id="lastName" {...register('lastName')} />
              <FormMessage>{errors.lastName?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="firstName">Prénom *</FormLabel>
              <Input id="firstName" {...register('firstName')} />
              <FormMessage>{errors.firstName?.message}</FormMessage>
            </FormItem>
          </div>

          {/* Adresse */}
          <FormItem>
            <FormLabel htmlFor="address">Adresse</FormLabel>
            <Input id="address" {...register('address')} />
            <FormMessage>{errors.address?.message}</FormMessage>
          </FormItem>

          {/* CP / Ville */}
          <div className="grid grid-cols-3 gap-4">
            <FormItem>
              <FormLabel htmlFor="zip">Code postal</FormLabel>
              <Input id="zip" {...register('zip')} />
              <FormMessage>{errors.zip?.message}</FormMessage>
            </FormItem>
            <FormItem className="col-span-2">
              <FormLabel htmlFor="city">Ville</FormLabel>
              <Input id="city" {...register('city')} />
              <FormMessage>{errors.city?.message}</FormMessage>
            </FormItem>
          </div>

          {/* Email */}
          <FormItem>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" {...register('email')} />
            <FormMessage>{errors.email?.message}</FormMessage>
          </FormItem>

          {/* Téléphone / Fax */}
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel htmlFor="phone">Téléphone</FormLabel>
              <Input id="phone" {...register('phone')} />
              <FormMessage>{errors.phone?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="fax">Fax</FormLabel>
              <Input id="fax" {...register('fax')} />
              <FormMessage>{errors.fax?.message}</FormMessage>
            </FormItem>
          </div>

          {/* N° adhérent / Montant */}
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel htmlFor="memberNumber">N° adhérent</FormLabel>
              <Input id="memberNumber" type="number" min={0} max={99} {...register('memberNumber', { valueAsNumber: true })} />
              <FormMessage>{errors.memberNumber?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="amount">Montant</FormLabel>
              <Input id="amount" type="number" min={0} step="0.01" {...register('amount', { valueAsNumber: true })} />
              <FormMessage>{errors.amount?.message}</FormMessage>
            </FormItem>
          </div>

          {/* Nom lao */}
          <FormItem>
            <FormLabel htmlFor="laoLastName">Nom en lao</FormLabel>
            <Input id="laoLastName" {...register('laoLastName')} />
            <FormMessage>{errors.laoLastName?.message}</FormMessage>
          </FormItem>

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
