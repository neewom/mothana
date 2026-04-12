import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { UserSearch } from './UserSearch';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('UserSearch', () => {
  it('renders the search input with the correct placeholder', () => {
    render(<UserSearch onSearch={vi.fn()} />);
    expect(
      screen.getByPlaceholderText(
        'Rechercher par nom, prénom, email ou ville...',
      ),
    ).toBeInTheDocument();
  });

  it('does not call onSearch immediately on input change', () => {
    const onSearch = vi.fn();
    render(<UserSearch onSearch={onSearch} />);
    const input = screen.getByRole('textbox');

    // onSearch is called once on mount (empty string), reset that count
    onSearch.mockClear();

    fireEvent.change(input, { target: { value: 'Dupont' } });
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('calls onSearch after the debounce delay', () => {
    const onSearch = vi.fn();
    render(<UserSearch onSearch={onSearch} debounceMs={300} />);
    const input = screen.getByRole('textbox');

    onSearch.mockClear();

    fireEvent.change(input, { target: { value: 'Dupont' } });
    expect(onSearch).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(300); });
    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('Dupont');
  });

  it('only fires onSearch once when typing quickly (debounce collapses events)', () => {
    const onSearch = vi.fn();
    render(<UserSearch onSearch={onSearch} debounceMs={300} />);
    const input = screen.getByRole('textbox');

    onSearch.mockClear();

    fireEvent.change(input, { target: { value: 'D' } });
    act(() => { vi.advanceTimersByTime(100); });
    fireEvent.change(input, { target: { value: 'Du' } });
    act(() => { vi.advanceTimersByTime(100); });
    fireEvent.change(input, { target: { value: 'Dup' } });
    act(() => { vi.advanceTimersByTime(300); });

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('Dup');
  });

  it('shows the reset button only when input has a value', () => {
    render(<UserSearch onSearch={vi.fn()} />);
    const input = screen.getByRole('textbox');

    expect(screen.queryByLabelText('Effacer la recherche')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'test' } });
    expect(screen.getByLabelText('Effacer la recherche')).toBeInTheDocument();
  });

  it('clears the input and calls onSearch("") when reset is clicked', () => {
    const onSearch = vi.fn();
    render(<UserSearch onSearch={onSearch} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Paris' } });
    onSearch.mockClear();

    fireEvent.click(screen.getByLabelText('Effacer la recherche'));
    expect(input.value).toBe('');
    expect(onSearch).toHaveBeenCalledWith('');
  });
});
