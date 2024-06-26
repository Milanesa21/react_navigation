import React, { useState } from 'react';
import { View, Text, Button, Image, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'; 
import { moderateScale } from 'react-native-size-matters';

const PokeApi = () => {
  const navigation = useNavigation(); 

  const [pokemonData, setPokemonData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      const data = await response.json();

      const newData = await Promise.all(
        data.results.map(async (result) => {
          const pokemonResponse = await fetch(result.url);
          return pokemonResponse.json();
        })
      );
      
      setPokemonData((prevData) => [...prevData, ...newData]);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error('Error trayendo los datos:', error);
    } finally {
        setLoading(false);
    }
  };

  const renderPokemonItem = ({ item }) => {
    return (
      <Card containerStyle={{ width: moderateScale(300) }}>
        <View>
          <Image
            source={{ uri: item.sprites.front_default }}
            style={{ width: moderateScale(200), height: moderateScale(200) }}
          />
          <Text>Nombre: {item.name}</Text>
          <Text>Type: {item.types.map(type => type.type.name).join(',')}</Text>
          <Text>Altura: {moderateScale(item.height * 10)} cm</Text>
          <Text>Peso: {item.weight} kg</Text>
        </View>
      </Card>
    );
  };

  const handleLoadMore = () => {
    fetchData();
  };

  const handleNavigateToMonkey = () => {
    navigation.navigate('Monkey'); 
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Pokemon Data:</Text>
      <FlatList
        data={pokemonData}
        renderItem={renderPokemonItem}
        keyExtractor={(item, index) => item.id.toString() + index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <Button title="Cargar Más Pokémon" onPress={handleLoadMore} disabled={loading} />
      <Button title="Ir a Monkey" onPress={handleNavigateToMonkey} />
    </View>
  );
};

export default PokeApi;
