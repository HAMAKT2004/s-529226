
import { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
  brand?: string;
}

interface CompareContextType {
  compareList: Product[];
  favorites: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompareList: () => void;
  isInCompareList: (productId: string) => boolean;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isInFavorites: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compareList, setCompareList] = useState<Product[]>(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCompare = (product: Product) => {
    if (compareList.length >= 6) {
      alert('You can compare a maximum of 6 products at once.');
      return;
    }
    if (!compareList.some(item => item.id === product.id)) {
      setCompareList([...compareList, product]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter(product => product.id !== productId));
  };

  const clearCompareList = () => {
    setCompareList([]);
  };

  const isInCompareList = (productId: string) => {
    return compareList.some(product => product.id === productId);
  };

  const addToFavorites = (product: Product) => {
    if (!favorites.some(item => item.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(favorites.filter(product => product.id !== productId));
  };

  const isInFavorites = (productId: string) => {
    return favorites.some(product => product.id === productId);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      favorites,
      addToCompare,
      removeFromCompare,
      clearCompareList,
      isInCompareList,
      addToFavorites,
      removeFromFavorites,
      isInFavorites
    }}>
      {children}
    </CompareContext.Provider>
  );
};
