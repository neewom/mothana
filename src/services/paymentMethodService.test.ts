import { describe, it, expect, beforeEach } from 'vitest';
import { paymentMethodService } from './paymentMethodService';

const STORAGE_KEY = 'mothana_payment_methods';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

describe('paymentMethodService', () => {
  it('returns mock payment methods on first call', async () => {
    const methods = await paymentMethodService.getAll();
    expect(methods.length).toBeGreaterThan(0);
  });

  it('getById returns the correct payment method', async () => {
    const all = await paymentMethodService.getAll();
    const first = all[0];
    const found = await paymentMethodService.getById(first.id);
    expect(found).toEqual(first);
  });

  it('getById returns undefined for unknown id', async () => {
    const found = await paymentMethodService.getById(9999);
    expect(found).toBeUndefined();
  });

  it('create adds a new payment method and assigns an id', async () => {
    const created = await paymentMethodService.create({ description: 'Espèces' });
    expect(created.id).toBeGreaterThan(0);
    const all = await paymentMethodService.getAll();
    expect(all.some((p) => p.id === created.id)).toBe(true);
  });

  it('update modifies the payment method description', async () => {
    const all = await paymentMethodService.getAll();
    const target = all[0];
    const updated = await paymentMethodService.update(target.id, { description: 'Modifié' });
    expect(updated.description).toBe('Modifié');
    const fetched = await paymentMethodService.getById(target.id);
    expect(fetched?.description).toBe('Modifié');
  });

  it('update throws for unknown id', async () => {
    await expect(paymentMethodService.update(9999, { description: 'X' })).rejects.toThrow();
  });

  it('delete removes the payment method', async () => {
    const all = await paymentMethodService.getAll();
    const target = all[0];
    await paymentMethodService.delete(target.id);
    const after = await paymentMethodService.getAll();
    expect(after.some((p) => p.id === target.id)).toBe(false);
  });

  it('delete throws for unknown id', async () => {
    await expect(paymentMethodService.delete(9999)).rejects.toThrow();
  });

  it('create ids are strictly increasing', async () => {
    const p1 = await paymentMethodService.create({ description: 'P1' });
    const p2 = await paymentMethodService.create({ description: 'P2' });
    expect(p2.id).toBeGreaterThan(p1.id);
  });
});
