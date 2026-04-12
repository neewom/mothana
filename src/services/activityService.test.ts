import { describe, it, expect, beforeEach } from 'vitest';
import { activityService } from './activityService';

const STORAGE_KEY = 'mothana_activities';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

describe('activityService', () => {
  it('returns mock activities on first call', async () => {
    const activities = await activityService.getAll();
    expect(activities.length).toBeGreaterThan(0);
  });

  it('getById returns the correct activity', async () => {
    const all = await activityService.getAll();
    const first = all[0];
    const found = await activityService.getById(first.id);
    expect(found).toEqual(first);
  });

  it('getById returns undefined for unknown id', async () => {
    const found = await activityService.getById(9999);
    expect(found).toBeUndefined();
  });

  it('create adds a new activity and assigns an id', async () => {
    const created = await activityService.create({
      description: 'Nouvelle collecte',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      estimation: 1000,
      total: 0,
      expense: 0,
      checkTotal: 0,
      cashTotal: 0,
    });
    expect(created.id).toBeGreaterThan(0);
    const all = await activityService.getAll();
    expect(all.some((a) => a.id === created.id)).toBe(true);
  });

  it('update modifies the activity description', async () => {
    const all = await activityService.getAll();
    const target = all[0];
    const updated = await activityService.update(target.id, { description: 'Modifiée' });
    expect(updated.description).toBe('Modifiée');
    const fetched = await activityService.getById(target.id);
    expect(fetched?.description).toBe('Modifiée');
  });

  it('update throws for unknown id', async () => {
    await expect(activityService.update(9999, { description: 'X' })).rejects.toThrow();
  });

  it('delete removes the activity', async () => {
    const all = await activityService.getAll();
    const target = all[0];
    await activityService.delete(target.id);
    const after = await activityService.getAll();
    expect(after.some((a) => a.id === target.id)).toBe(false);
  });

  it('delete throws for unknown id', async () => {
    await expect(activityService.delete(9999)).rejects.toThrow();
  });

  it('create ids are strictly increasing', async () => {
    const base = {
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      estimation: 500,
      total: 0,
      expense: 0,
      checkTotal: 0,
      cashTotal: 0,
    };
    const a1 = await activityService.create({ ...base, description: 'A1' });
    const a2 = await activityService.create({ ...base, description: 'A2' });
    expect(a2.id).toBeGreaterThan(a1.id);
  });
});
