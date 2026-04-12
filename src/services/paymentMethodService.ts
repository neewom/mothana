import type { PaymentMethod } from '../types';
import { mockPaymentMethods } from '../data/mockData';

const STORAGE_KEY = 'mothana_payment_methods';

function load(): PaymentMethod[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const initial = mockPaymentMethods.map((p) => ({ ...p }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw) as PaymentMethod[];
}

function save(paymentMethods: PaymentMethod[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentMethods));
}

function nextId(paymentMethods: PaymentMethod[]): number {
  return paymentMethods.length === 0
    ? 1
    : Math.max(...paymentMethods.map((p) => p.id)) + 1;
}

export const paymentMethodService = {
  async getAll(): Promise<PaymentMethod[]> {
    return load();
  },

  async getById(id: number): Promise<PaymentMethod | undefined> {
    return load().find((p) => p.id === id);
  },

  async create(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const all = load();
    const created: PaymentMethod = { ...paymentMethod, id: nextId(all) };
    save([...all, created]);
    return created;
  },

  async update(id: number, paymentMethod: Partial<Omit<PaymentMethod, 'id'>>): Promise<PaymentMethod> {
    const all = load();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`PaymentMethod ${id} not found`);
    const updated: PaymentMethod = { ...all[index], ...paymentMethod };
    const next = [...all];
    next[index] = updated;
    save(next);
    return updated;
  },

  async delete(id: number): Promise<void> {
    const all = load();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`PaymentMethod ${id} not found`);
    save(all.filter((p) => p.id !== id));
  },
};
