import type { Civility } from '../types';
import { mockCivilities } from '../data/mockData';

const STORAGE_KEY = 'mothana_civilities';

function load(): Civility[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const initial = mockCivilities.map((c) => ({ ...c }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw) as Civility[];
}

function save(civilities: Civility[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(civilities));
}

function nextId(civilities: Civility[]): number {
  return civilities.length === 0
    ? 1
    : Math.max(...civilities.map((c) => c.id)) + 1;
}

export const civilityService = {
  async getAll(): Promise<Civility[]> {
    return load();
  },

  async getById(id: number): Promise<Civility | undefined> {
    return load().find((c) => c.id === id);
  },

  async create(civility: Omit<Civility, 'id'>): Promise<Civility> {
    const all = load();
    const created: Civility = { ...civility, id: nextId(all) };
    save([...all, created]);
    return created;
  },

  async update(
    id: number,
    civility: Partial<Omit<Civility, 'id'>>,
  ): Promise<Civility> {
    const all = load();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Civility ${id} not found`);
    const updated: Civility = { ...all[index], ...civility };
    const next = [...all];
    next[index] = updated;
    save(next);
    return updated;
  },

  async delete(id: number): Promise<void> {
    const all = load();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Civility ${id} not found`);
    save(all.filter((c) => c.id !== id));
  },
};
