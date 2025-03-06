
import { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
}

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompareList: () => void;
  isInCompareList: (productId: string) => boolean;
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

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

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

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompareList,
      isInCompareList
    }}>
      {children}
    </CompareContext.Provider>
  );
};
