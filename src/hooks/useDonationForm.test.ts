import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';

const TRANSACTIONS_KEY = 'mothana_transactions';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  localStorage.removeItem(TRANSACTIONS_KEY);
  mockNavigate.mockClear();
});

function wrapper(initialEntries: string[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(MemoryRouter, { initialEntries }, children);
  };
}

describe('useDonationForm', () => {
  it('returns undefined defaultUserId when no query param', async () => {
    const { useDonationForm } = await import('./useDonationForm');
    const { result } = renderHook(() => useDonationForm(), {
      wrapper: wrapper(['/donations/new']),
    });
    expect(result.current.defaultUserId).toBeUndefined();
  });

  it('reads userId from query params', async () => {
    const { useDonationForm } = await import('./useDonationForm');
    const { result } = renderHook(() => useDonationForm(), {
      wrapper: wrapper(['/donations/new?userId=3']),
    });
    expect(result.current.defaultUserId).toBe(3);
  });

  it('save calls transactionService.create with correct values', async () => {
    const { useDonationForm } = await import('./useDonationForm');
    const { result } = renderHook(() => useDonationForm(), {
      wrapper: wrapper(['/donations/new']),
    });

    const data = {
      userId: 1,
      activityId: 1,
      date: '2024-05-01',
      amount: 100,
      paymentMethod: 2,
      receiptId: 'R001',
      receiptDate: '2024-05-05',
      totalExpense: 0,
      checkNumber: 0,
      bankName: '',
      bankCity: '',
      checkDate: '',
      notes: '',
    };

    await act(() => result.current.save(data));

    const stored = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) ?? '[]');
    expect(stored.some((t: { userId: number; amount: number }) => t.userId === 1 && t.amount === 100)).toBe(true);
  });

  it('redirects to /donations after save', async () => {
    const { useDonationForm } = await import('./useDonationForm');
    const { result } = renderHook(() => useDonationForm(), {
      wrapper: wrapper(['/donations/new']),
    });

    const data = {
      userId: 1,
      activityId: 1,
      date: '2024-05-01',
      amount: 50,
      paymentMethod: 2,
      receiptId: '',
      receiptDate: '',
      totalExpense: 0,
      checkNumber: 0,
      bankName: '',
      bankCity: '',
      checkDate: '',
      notes: '',
    };

    await act(() => result.current.save(data));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/donations'));
  });
});
