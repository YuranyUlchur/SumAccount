import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Category {
  name: string;
  icon: string;
  total: number;
}

interface CategoryContextProps {
  categories: Category[];
  updateCategoryTotals: (categoryName: string, total: number) => void;
}

interface CategoryProviderProps {
  children: ReactNode;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const initialCategories = [
    {
      name: 'Comida',
      icon: 'https://cdn.icon-icons.com/icons2/2852/PNG/512/burger_fast_food_icon_181517.png',
      total: 0,
    },
    {
      name: 'Ropa',
      icon: 'https://static.vecteezy.com/system/resources/previews/012/658/517/original/shirt-3d-icon-3d-render-concept-png.png',
      total: 0,
    },
    {
      name: 'Aseo',
      icon: 'https://cdn3d.iconscout.com/3d/premium/thumb/toiletries-6368181-5252773.png?f=webp',
      total: 0,
    },
    {
      name: 'Salud',
      icon: 'https://static.vecteezy.com/system/resources/previews/021/640/103/non_2x/3d-clipboard-sheet-of-paper-document-medical-report-icon-isolated-on-white-background-3d-health-insurance-concept-cartoon-minimal-style-3d-icon-render-illustration-vector.jpg',
      total: 0,
    },
  ];

  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const updateCategoryTotals = (categoryName: string, total: number) => {
    const updatedCategories = categories.map(category =>
      category.name === categoryName ? { ...category, total } : category
    );
    setCategories(updatedCategories);
  };

  const updateItems = (categoryName: string, newItems: Item[]) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.name === categoryName ? { ...category, items: newItems } : category
      )
    );
  };

  useEffect(() => {
    const loadCategoryTotals = async () => {
      try {
        const updatedCategories = await Promise.all(
          categories.map(async (category) => {
            const total = await calculateTotalForCategory(category.name);
            return { ...category, total };
          })
        );
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error loading category totals:', error);
      }
    };

    const calculateTotalForCategory = async (categoryName: string) => {
      try {
        const savedItems = await AsyncStorage.getItem(categoryName);
        let total = 0;
        if (savedItems) {
          const items = JSON.parse(savedItems);
          total = items.reduce((acc: number, item: { price: number }) => acc + item.price, 0);
        }
        return total;
      } catch (error) {
        console.error(`Error loading total for ${categoryName}:`, error);
        return 0;
      }
    };

    loadCategoryTotals();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, updateCategoryTotals }}>
      {children}
    </CategoryContext.Provider>
  );
};