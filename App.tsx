/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home/Home';
import CategorySelection from './components/CategorySelection/CategorySelection';
import { CategoryProvider } from './components/CategoryContext/CategoryContext';

export type RootStackParamList = {
  CategorySelection: undefined;
  Home: { category: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <CategoryProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CategorySelection"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTransparent: true,
          headerTintColor: '#333',
          headerTitle: () => null,
        }}>
        <Stack.Screen name="CategorySelection" component={CategorySelection} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  </CategoryProvider>
);
};
export default App;
