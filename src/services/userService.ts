import type { User } from '../types';
import { mockUsers } from '../data/mockData';

const STORAGE_KEY = 'mothana_users';

function load(): User[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const initial = mockUsers.map((u) => ({ ...u }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw) as User[];
}

function save(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function nextId(users: User[]): number {
  return users.length === 0
    ? 1
    : Math.max(...users.map((u) => u.id)) + 1;
}

export const userService = {
  async getAll(): Promise<User[]> {
    return load();
  },

  async getById(id: number): Promise<User | undefined> {
    return load().find((u) => u.id === id);
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    const all = load();
    const created: User = { ...user, id: nextId(all) };
    save([...all, created]);
    return created;
  },

  async update(id: number, user: Partial<Omit<User, 'id'>>): Promise<User> {
    const all = load();
    const index = all.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User ${id} not found`);
    const updated: User = { ...all[index], ...user };
    const next = [...all];
    next[index] = updated;
    save(next);
    return updated;
  },

  async delete(id: number): Promise<void> {
    const all = load();
    const index = all.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User ${id} not found`);
    save(all.filter((u) => u.id !== id));
  },
};
