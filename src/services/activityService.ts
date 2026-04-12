import type { Activity } from '../types';
import { mockActivities } from '../data/mockData';

const STORAGE_KEY = 'mothana_activities';

function load(): Activity[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const initial = mockActivities.map((a) => ({ ...a }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw) as Activity[];
}

function save(activities: Activity[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

function nextId(activities: Activity[]): number {
  return activities.length === 0
    ? 1
    : Math.max(...activities.map((a) => a.id)) + 1;
}

export const activityService = {
  async getAll(): Promise<Activity[]> {
    return load();
  },

  async getById(id: number): Promise<Activity | undefined> {
    return load().find((a) => a.id === id);
  },

  async create(activity: Omit<Activity, 'id'>): Promise<Activity> {
    const all = load();
    const created: Activity = { ...activity, id: nextId(all) };
    save([...all, created]);
    return created;
  },

  async update(id: number, activity: Partial<Omit<Activity, 'id'>>): Promise<Activity> {
    const all = load();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Activity ${id} not found`);
    const updated: Activity = { ...all[index], ...activity };
    const next = [...all];
    next[index] = updated;
    save(next);
    return updated;
  },

  async delete(id: number): Promise<void> {
    const all = load();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Activity ${id} not found`);
    save(all.filter((a) => a.id !== id));
  },
};
