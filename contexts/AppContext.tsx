import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface SportItem {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  category: 'Match' | 'Player' | 'Team';
  date?: string;
}

interface AppContextType {
  favourites: SportItem[];
  addFavourite: (item: SportItem) => void;
  removeFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<SportItem[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('light');

  const addFavourite = (item: SportItem) => {
    setFavourites((prev) => {
      if (prev.find((fav) => fav.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavourite = (id: string) => {
    return favourites.some((item) => item.id === id);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppContext.Provider
      value={{
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
        user,
        setUser,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
