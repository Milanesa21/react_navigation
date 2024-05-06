
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PokeApi from './pokeApi.js';
import Monkey from './Monkey.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PokeApi">
        <Stack.Screen name="PokeApi" component={PokeApi} />
        <Stack.Screen name="Monkey" component={Monkey} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
