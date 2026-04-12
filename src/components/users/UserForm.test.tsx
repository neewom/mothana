import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserForm } from './UserForm';

const CIVILITIES_KEY = 'mothana_civilities';

beforeEach(() => {
  localStorage.removeItem(CIVILITIES_KEY);
});

const defaultProps = {
  isOpen: true,
  selectedUser: null,
  isSaving: false,
  onSave: vi.fn(),
  onClose: vi.fn(),
};

describe('UserForm', () => {
  it('renders create title when no user is selected', () => {
    render(<UserForm {...defaultProps} />);
    expect(screen.getByText('Nouvel utilisateur')).toBeInTheDocument();
  });

  it('renders edit title when a user is selected', () => {
    const user = {
      id: 1,
      civilityId: 1,
      lastName: 'Dupont',
      firstName: 'Jean',
      address: '',
      zip: '',
      city: '',
      email: '',
      phone: '',
      fax: '',
      memberNumber: 0,
      laoLastName: '',
      amount: 0,
    };
    render(<UserForm {...defaultProps} selectedUser={user} />);
    expect(screen.getByText("Modifier l'utilisateur")).toBeInTheDocument();
  });

  it('shows "Créer" button label in create mode', () => {
    render(<UserForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument();
  });

  it('shows "Enregistrer" button label in edit mode', () => {
    const user = {
      id: 1,
      civilityId: 1,
      lastName: 'Dupont',
      firstName: 'Jean',
      address: '',
      zip: '',
      city: '',
      email: '',
      phone: '',
      fax: '',
      memberNumber: 0,
      laoLastName: '',
      amount: 0,
    };
    render(<UserForm {...defaultProps} selectedUser={user} />);
    expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument();
  });

  it('shows "Enregistrement…" and disables submit when saving', () => {
    render(<UserForm {...defaultProps} isSaving={true} />);
    expect(screen.getByText('Enregistrement…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enregistrement…' })).toBeDisabled();
  });

  it('shows validation error for empty lastName on submit', async () => {
    render(<UserForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));
    await waitFor(() => {
      expect(screen.getAllByText('Requis').length).toBeGreaterThan(0);
    });
  });

  it('calls onClose when Annuler button is clicked', () => {
    const onClose = vi.fn();
    render(<UserForm {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not render when isOpen is false', () => {
    render(<UserForm {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Nouvel utilisateur')).not.toBeInTheDocument();
  });
});
