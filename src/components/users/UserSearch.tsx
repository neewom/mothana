import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface UserSearchProps {
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function UserSearch({ onSearch, debounceMs = 300 }: UserSearchProps) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [value, debounceMs, onSearch]);

  function handleReset() {
    setValue('');
    onSearch('');
  }

  return (
    <div className="relative flex items-center">
      <Search
        className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher par nom, prénom, email ou ville..."
        className="h-9 w-full rounded-md border border-input bg-transparent py-1 pl-9 pr-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Recherche utilisateurs"
      />
      {value && (
        <button
          type="button"
          onClick={handleReset}
          aria-label="Effacer la recherche"
          className="absolute right-2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
