import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';

const Stack = createStackNavigator();

const App = () => {
    const [loaded] = useFonts({
      'Exo-Bold': require('./assets/fonts/Exo-Bold.otf'),
      'weather': require('./assets/fonts/Weather.otf'),
    });
  
    if (!loaded) {
      return null;
    }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Weather App',
            headerStyle: {
              backgroundColor: '#99B3FC',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              fontFamily: 'weather',
              fontSize: 39,
              color: '#000000',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} 
        options={{
          title: 'City Details',
          headerStyle: {
            backgroundColor: '#99B3FC',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontFamily: 'weather',
            fontSize: 39,
            color: '#000000',
          },
          headerTitleAlign: 'center',
        }}
         />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
