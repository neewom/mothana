import type { Transaction } from '../types';
import { mockTransactions } from '../data/mockData';

const STORAGE_KEY = 'mothana_transactions';

function load(): Transaction[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const initial = mockTransactions.map((t) => ({ ...t }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw) as Transaction[];
}

function save(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function nextId(transactions: Transaction[]): number {
  return transactions.length === 0
    ? 1
    : Math.max(...transactions.map((t) => t.id)) + 1;
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    return load();
  },

  async getById(id: number): Promise<Transaction | undefined> {
    return load().find((t) => t.id === id);
  },

  async getByUserId(userId: number): Promise<Transaction[]> {
    return load().filter((t) => t.userId === userId);
  },

  async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const all = load();
    const created: Transaction = { ...transaction, id: nextId(all) };
    save([...all, created]);
    return created;
  },

  async update(id: number, transaction: Partial<Omit<Transaction, 'id'>>): Promise<Transaction> {
    const all = load();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Transaction ${id} not found`);
    const updated: Transaction = { ...all[index], ...transaction };
    const next = [...all];
    next[index] = updated;
    save(next);
    return updated;
  },

  async delete(id: number): Promise<void> {
    const all = load();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Transaction ${id} not found`);
    save(all.filter((t) => t.id !== id));
  },
};
