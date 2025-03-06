
import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  clearFavorites: () => void;
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
  const { toast } = useToast();
  
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
      toast({
        title: 'Maximum products reached',
        description: 'You can compare a maximum of 6 products at once.',
        variant: 'destructive',
      });
      return;
    }
    if (!compareList.some(item => item.id === product.id)) {
      setCompareList([...compareList, product]);
      toast({
        title: 'Added to compare',
        description: `${product.name} has been added to your compare list.`,
      });
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter(product => product.id !== productId));
    toast({
      title: 'Removed from compare',
      description: 'Product has been removed from your compare list.',
    });
  };

  const clearCompareList = () => {
    setCompareList([]);
    toast({
      title: 'Compare list cleared',
      description: 'All products have been removed from your compare list.',
    });
  };

  const isInCompareList = (productId: string) => {
    return compareList.some(product => product.id === productId);
  };

  const addToFavorites = (product: Product) => {
    if (!favorites.some(item => item.id === product.id)) {
      setFavorites([...favorites, product]);
      toast({
        title: 'Added to favorites',
        description: `${product.name} has been added to your favorites.`,
      });
    }
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(favorites.filter(product => product.id !== productId));
    toast({
      title: 'Removed from favorites',
      description: 'Product has been removed from your favorites.',
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast({
      title: 'Favorites cleared',
      description: 'All products have been removed from your favorites.',
    });
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
      isInFavorites,
      clearFavorites
    }}>
      {children}
    </CompareContext.Provider>
  );
};
