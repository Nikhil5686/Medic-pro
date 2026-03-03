import { useState, useEffect } from 'react';

const KEY = 'acc-dose-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem(KEY);
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(favorites)); }, [favorites]);

  const toggle = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const isFav = (id: string) => favorites.includes(id);

  return { favorites, toggle, isFav };
}
