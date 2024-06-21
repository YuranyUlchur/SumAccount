import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useCategoryContext } from '../CategoryContext/CategoryContext';
import styles from './Style';

type CategorySelectionNavigationProp = NavigationProp<
  RootStackParamList,
  'CategorySelection'
>;

const CategorySelection = () => {
  const navigation = useNavigation<CategorySelectionNavigationProp>();
  const { categories, loadCategoryTotals } = useCategoryContext();

  const handleCategorySelect = (category: string) => {
    navigation.navigate('Home', { category, loadCategoryTotals });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={styles.categoryButton}
          onPress={() => handleCategorySelect(category.name)}>
          <View style={styles.categoryItem}>
            <Image source={{ uri: category.icon }} style={styles.icon} />
            <View >
              <Text style={styles.categoryText}>{category.name}</Text>
              <Text>Total: ${category.total.toLocaleString('es-CO')}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CategorySelection;