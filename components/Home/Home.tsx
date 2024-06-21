import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useCategoryContext } from '../CategoryContext/CategoryContext';
import styles from './Style';

interface Item {
  id: string;
  name: string;
  price: number;
  date: Date;
}

type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Home = () => {
  const { categories, updateCategoryTotals } = useCategoryContext();
  const route = useRoute<HomeRouteProp>();
  const navigation = useNavigation<HomeNavigationProp>();
  const { category } = route.params;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<string>('');

  const formatNumberWithDots = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    });
  };

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPrice(numericValue ? formatNumberWithDots(numericValue) : '');
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem(category);
        if (savedItems !== null) {
          setItems(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };
    loadItems();
  }, [category]);

  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(total);
    setCurrentMonth(new Date().toLocaleString('es-ES', { month: 'long' }));

    const saveItems = async () => {
      try {
        await AsyncStorage.setItem(category, JSON.stringify(items));
        updateCategoryTotals(category, total);
      } catch (error) {
        console.error('Error saving items:', error);
      }
    };

    saveItems();
  }, [items, category, updateCategoryTotals]);

  const handleAddItem = () => {
    if (!name || !price) {
      return;
    }

    const numericPrice = parseFloat(price.replace(/\./g, ''));
    const dateNow = new Date();
    const newItem: Item = {
      id: String(Date.now()),
      name,
      price: numericPrice,
      date: dateNow,
    };

    setItems([...items, newItem]);
    setName('');
    setPrice('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
          placeholder="$Precio"
          placeholderTextColor="#aaa"
        />
        <Button title="Enviar" onPress={handleAddItem} />
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>
              {formatNumberWithDots(item.price)}
            </Text>
            {item.date && item.date instanceof Date ? (
              <Text style={styles.itemText}>
                {item.date.toLocaleString('es-ES', { month: 'long' })}/{item.date.getDate()}
              </Text>
            ) : null}
            <Button
              color={'#ff6961'}
              title="Eliminar"
              onPress={() => handleDeleteItem(item.id)}
            />
          </View>
        )}
      />
      <Text style={styles.total}>
        Total {currentMonth}: {formatNumberWithDots(totalPrice)}
      </Text>
    </View>
  );
};

export default Home;