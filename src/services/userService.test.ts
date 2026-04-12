import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from './userService';
import type { User } from '../types';

const STORAGE_KEY = 'mothana_users';

const newUserData: Omit<User, 'id'> = {
  civilityId: 1,
  lastName: 'Test',
  firstName: 'User',
  address: '1 rue de Test',
  zip: '75000',
  city: 'Paris',
  amount: 100,
  phone: '0600000000',
  fax: '',
  email: 'test@example.com',
  memberNumber: 99,
  laoLastName: 'ທົດສອບ',
};

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

describe('userService', () => {
  describe('getAll', () => {
    it('returns an array of User seeded from mock data on first call', async () => {
      const result = await userService.getAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toMatchObject({
        id: expect.any(Number),
        lastName: expect.any(String),
        email: expect.any(String),
      });
    });
  });

  describe('getById', () => {
    it('returns the correct user for an existing id', async () => {
      const all = await userService.getAll();
      const target = all[0];
      const result = await userService.getById(target.id);
      expect(result).toEqual(target);
    });

    it('returns undefined for a non-existing id', async () => {
      const result = await userService.getById(9999);
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('adds a new user and returns it with a generated id', async () => {
      const before = await userService.getAll();
      const created = await userService.create(newUserData);
      expect(created.id).toBeDefined();
      expect(created.lastName).toBe('Test');
      const after = await userService.getAll();
      expect(after.length).toBe(before.length + 1);
      expect(after.find((u) => u.id === created.id)).toEqual(created);
    });

    it('assigns ids that are strictly greater than any existing id', async () => {
      const first = await userService.create({ ...newUserData, lastName: 'A' });
      const second = await userService.create({ ...newUserData, lastName: 'B' });
      expect(second.id).toBeGreaterThan(first.id);
    });
  });

  describe('update', () => {
    it('updates only the specified fields and returns the merged object', async () => {
      const all = await userService.getAll();
      const target = all[0];
      const updated = await userService.update(target.id, { lastName: 'Renamed', amount: 999 });
      expect(updated.id).toBe(target.id);
      expect(updated.lastName).toBe('Renamed');
      expect(updated.amount).toBe(999);
      // unchanged field
      expect(updated.firstName).toBe(target.firstName);
    });

    it('throws when the id does not exist', async () => {
      await expect(userService.update(9999, { lastName: 'X' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('removes the user from the list', async () => {
      const all = await userService.getAll();
      const target = all[0];
      await userService.delete(target.id);
      const after = await userService.getAll();
      expect(after.find((u) => u.id === target.id)).toBeUndefined();
      expect(after.length).toBe(all.length - 1);
    });

    it('throws when the id does not exist', async () => {
      await expect(userService.delete(9999)).rejects.toThrow();
    });
  });
});
