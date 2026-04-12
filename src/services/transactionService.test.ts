import { describe, it, expect, beforeEach } from 'vitest';
import { transactionService } from './transactionService';

const STORAGE_KEY = 'mothana_transactions';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

const newTransaction = {
  activityId: 1,
  userId: 1,
  date: '2024-08-01',
  amount: 50,
  paymentMethod: 1,
  notes: '',
  checkNumber: 0,
  bankName: '',
  bankCity: '',
};

describe('transactionService', () => {
  it('returns mock transactions on first call', async () => {
    const transactions = await transactionService.getAll();
    expect(transactions.length).toBeGreaterThan(0);
  });

  it('getById returns the correct transaction', async () => {
    const all = await transactionService.getAll();
    const first = all[0];
    const found = await transactionService.getById(first.id);
    expect(found).toEqual(first);
  });

  it('getById returns undefined for unknown id', async () => {
    const found = await transactionService.getById(9999);
    expect(found).toBeUndefined();
  });

  it('getByUserId returns only transactions for the given user', async () => {
    const all = await transactionService.getAll();
    const userId = all[0].userId;
    const filtered = await transactionService.getByUserId(userId);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((t) => t.userId === userId)).toBe(true);
  });

  it('getByUserId returns empty array for user with no transactions', async () => {
    const result = await transactionService.getByUserId(9999);
    expect(result).toEqual([]);
  });

  it('create adds a new transaction and assigns an id', async () => {
    const created = await transactionService.create(newTransaction);
    expect(created.id).toBeGreaterThan(0);
    const all = await transactionService.getAll();
    expect(all.some((t) => t.id === created.id)).toBe(true);
  });

  it('update modifies the transaction amount', async () => {
    const all = await transactionService.getAll();
    const target = all[0];
    const updated = await transactionService.update(target.id, { amount: 9999 });
    expect(updated.amount).toBe(9999);
    const fetched = await transactionService.getById(target.id);
    expect(fetched?.amount).toBe(9999);
  });

  it('update throws for unknown id', async () => {
    await expect(transactionService.update(9999, { amount: 1 })).rejects.toThrow();
  });

  it('delete removes the transaction', async () => {
    const all = await transactionService.getAll();
    const target = all[0];
    await transactionService.delete(target.id);
    const after = await transactionService.getAll();
    expect(after.some((t) => t.id === target.id)).toBe(false);
  });

  it('delete throws for unknown id', async () => {
    await expect(transactionService.delete(9999)).rejects.toThrow();
  });
});
