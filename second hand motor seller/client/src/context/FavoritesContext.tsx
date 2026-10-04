import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from './AuthContext.js';

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (vehicleId: string) => Promise<void>;
  isFavorited: (vehicleId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('motorvault_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set(['veh-001', 'veh-002']);
    } catch {
      return new Set(['veh-001', 'veh-002']);
    }
  });

  // Sync favorites when user logs in
  useEffect(() => {
    async function loadApiFavorites() {
      if (!token) return;
      try {
        const data = await apiRequest<{ favorites: Array<{ id: string }> }>('/favorites');
        if (data.favorites) {
          const ids = new Set(data.favorites.map(f => f.id));
          setFavorites(ids);
          localStorage.setItem('motorvault_favorites', JSON.stringify(Array.from(ids)));
        }
      } catch (err) {
        console.warn('Could not sync favorites with API:', err);
      }
    }
    loadApiFavorites();
  }, [token]);

  const toggleFavorite = async (vehicleId: string) => {
    const nextFavorites = new Set(favorites);
    const isAdding = !nextFavorites.has(vehicleId);

    if (isAdding) {
      nextFavorites.add(vehicleId);
    } else {
      nextFavorites.delete(vehicleId);
    }

    setFavorites(nextFavorites);
    localStorage.setItem('motorvault_favorites', JSON.stringify(Array.from(nextFavorites)));

    if (token) {
      try {
        if (isAdding) {
          await apiRequest('/favorites', {
            method: 'POST',
            body: JSON.stringify({ vehicleId })
          });
        } else {
          await apiRequest(`/favorites/${vehicleId}`, {
            method: 'DELETE'
          });
        }
      } catch (err) {
        console.warn('Failed to sync favorite change with server:', err);
      }
    }
  };

  const isFavorited = (vehicleId: string) => favorites.has(vehicleId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
