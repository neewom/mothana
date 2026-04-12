import { describe, it, expect, beforeEach } from 'vitest';
import { civilityService } from './civilityService';

const STORAGE_KEY = 'mothana_civilities';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

describe('civilityService', () => {
  describe('getAll', () => {
    it('returns an array of Civility seeded from mock data on first call', async () => {
      const result = await civilityService.getAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toMatchObject({ id: expect.any(Number), description: expect.any(String) });
    });
  });

  describe('getById', () => {
    it('returns the correct civility for an existing id', async () => {
      const all = await civilityService.getAll();
      const target = all[0];
      const result = await civilityService.getById(target.id);
      expect(result).toEqual(target);
    });

    it('returns undefined for a non-existing id', async () => {
      const result = await civilityService.getById(9999);
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('adds a new civility and returns it with a generated id', async () => {
      const before = await civilityService.getAll();
      const created = await civilityService.create({ description: 'Prof.' });
      expect(created.id).toBeDefined();
      expect(created.description).toBe('Prof.');
      const after = await civilityService.getAll();
      expect(after.length).toBe(before.length + 1);
      expect(after.find((c) => c.id === created.id)).toEqual(created);
    });

    it('assigns ids that are strictly greater than any existing id', async () => {
      const first = await civilityService.create({ description: 'A' });
      const second = await civilityService.create({ description: 'B' });
      expect(second.id).toBeGreaterThan(first.id);
    });
  });

  describe('update', () => {
    it('updates only the specified fields and returns the merged object', async () => {
      const all = await civilityService.getAll();
      const target = all[0];
      const updated = await civilityService.update(target.id, { description: 'Updated' });
      expect(updated.id).toBe(target.id);
      expect(updated.description).toBe('Updated');
    });

    it('throws when the id does not exist', async () => {
      await expect(civilityService.update(9999, { description: 'X' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('removes the civility from the list', async () => {
      const all = await civilityService.getAll();
      const target = all[0];
      await civilityService.delete(target.id);
      const after = await civilityService.getAll();
      expect(after.find((c) => c.id === target.id)).toBeUndefined();
      expect(after.length).toBe(all.length - 1);
    });

    it('throws when the id does not exist', async () => {
      await expect(civilityService.delete(9999)).rejects.toThrow();
    });
  });
});
