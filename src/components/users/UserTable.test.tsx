import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { UserTable } from './UserTable';
import type { User, Civility } from '@/types';

const civilities: Civility[] = [
  { id: 1, description: 'M.' },
  { id: 2, description: 'Mme' },
];

const users: User[] = [
  {
    id: 1,
    civilityId: 1,
    lastName: 'Dupont',
    firstName: 'Jean',
    address: '1 rue Test',
    zip: '75001',
    city: 'Paris',
    amount: 100,
    phone: '0600000001',
    fax: '',
    email: 'jean.dupont@test.fr',
    memberNumber: 1,
    laoLastName: '',
  },
  {
    id: 2,
    civilityId: 2,
    lastName: 'Martin',
    firstName: 'Sophie',
    address: '2 rue Test',
    zip: '69003',
    city: 'Lyon',
    amount: 200,
    phone: '0600000002',
    fax: '',
    email: 'sophie.martin@test.fr',
    memberNumber: 2,
    laoLastName: '',
  },
];

function renderTable(overrides?: Partial<Parameters<typeof UserTable>[0]>) {
  return render(
    <UserTable
      users={users}
      civilities={civilities}
      onSelect={vi.fn()}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      {...overrides}
    />,
  );
}

describe('UserTable', () => {
  it('renders the expected column headers', () => {
    renderTable();
    expect(screen.getByText('Civilité')).toBeInTheDocument();
    expect(screen.getByText('Nom')).toBeInTheDocument();
    expect(screen.getByText('Prénom')).toBeInTheDocument();
    expect(screen.getByText('Ville')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Téléphone')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders user data rows with resolved civility labels', () => {
    renderTable();
    expect(screen.getByText('Dupont')).toBeInTheDocument();
    expect(screen.getByText('Jean')).toBeInTheDocument();
    expect(screen.getByText('M.')).toBeInTheDocument();
    expect(screen.getByText('Martin')).toBeInTheDocument();
    expect(screen.getByText('Sophie')).toBeInTheDocument();
    expect(screen.getByText('Mme')).toBeInTheDocument();
  });

  it('displays "Aucun utilisateur trouvé" when the user list is empty', () => {
    renderTable({ users: [] });
    expect(screen.getByText('Aucun utilisateur trouvé')).toBeInTheDocument();
  });

  it('calls onSelect with the correct user when a row is clicked', () => {
    const onSelect = vi.fn();
    renderTable({ onSelect });
    fireEvent.click(screen.getByText('Dupont'));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(users[0]);
  });

  it('does not call onSelect when table is empty', () => {
    const onSelect = vi.fn();
    renderTable({ users: [], onSelect });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls onEdit with the correct user when edit button is clicked', () => {
    const onEdit = vi.fn();
    renderTable({ onEdit });
    const editButtons = screen.getAllByRole('button', { name: 'Modifier' });
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(users[0]);
  });

  it('calls onDelete with the correct user when delete button is clicked', () => {
    const onDelete = vi.fn();
    renderTable({ onDelete });
    const deleteButtons = screen.getAllByRole('button', { name: 'Supprimer' });
    fireEvent.click(deleteButtons[1]);
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(users[1]);
  });

  it('does not call onSelect when action buttons are clicked', () => {
    const onSelect = vi.fn();
    const onEdit = vi.fn();
    renderTable({ onSelect, onEdit });
    const editButtons = screen.getAllByRole('button', { name: 'Modifier' });
    fireEvent.click(editButtons[0]);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
