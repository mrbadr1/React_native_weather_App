const API_WEATHER_KEY = 'YOUR_WHEATERMAP_API_KEY_HERE';
const API_GOOGLE_KEY = 'YOUR_GOOGLE_API_KEY_HERE';
/////////////////////////////////////////
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Keyboard, FlatList ,TouchableHighlight } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { Button,  } from 'react-native-elements';
import Flag from 'react-native-flags';
import Autocomplete from 'react-native-autocomplete-input';
  /////////////////////////////////////////
const HomeScreen = ({ navigation }) => {
  /////////////////////////////////////////
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [isSearchPressed, setIsSearchPressed] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  /////////////////////////////////////////
  useEffect(() => {
    const fetchCitySuggestions = async (text) => {
      try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&key=${API_GOOGLE_KEY}`);
            const citySuggestions = response.data.predictions.map(prediction => ({ label: prediction.structured_formatting.main_text, value: { city: prediction.structured_formatting.main_text, country: prediction.structured_formatting.secondary_text } }));
            setCitySuggestions(citySuggestions);
            console.log(citySuggestions);
            //in console u can see the cities i tried to make them inside the list but it s not working
          } 
      catch (error) {
           console.error(error);
          }};
    fetchCitySuggestions(city);
  }, [city]);
  /////////////////////////////////////////
  const handleQueryChange = (text) => {
    setCity(text);
  };
    /////////////////////////////////////////
  const handleSelectCity = (city) => {
    setCity(city.label);
    setCitySuggestions([]);
  };
  /////////////////////////////////////////
  const renderCityItem = ({ item }) => {
    console.log(item);
    return (
      <TouchableHighlight
        onPress={() => handleSelectCity(item)}
        style={{ padding: 10 }}
        underlayColor="#ccc"
      >
        <Text>{item.value.city}</Text>
      </TouchableHighlight>
    );
  };
  /////////////////////////////////////////
  const renderSuggestions = () => (
    <FlatList
      data={citySuggestions}
      renderItem={renderCityItem}
      keyExtractor={(item, index) => index.toString()}
      style={{ maxHeight: 300 }}
    />
  );
  /////////////////////////////////////////
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);
  /////////////////////////////////////////
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_WEATHER_KEY}&units=metric`);
      setWeatherData(response.data);
      setCitySuggestions([]);
      Keyboard.dismiss(); // Hide the keyboard
      setIsSearchPressed(true);
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 2300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error(error);
    }
  };
  /////////////////////////////////////////
  useEffect(() => {
    setIsInputEmpty(city === '');
    if (city === '') {
        setIsSearchPressed(false);
      setWeatherData(null);
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [city]);
  /////////////////////////////////////////
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (city !== '' && weatherData !== null) {
        fetchWeatherData();
      }
    }, 60000); // Fetch weather data every minute
    return () => clearInterval(intervalId);
  }, [city, weatherData]);
  /////////////////////////////////////////
  const handleShowDetails = () => {
    navigation.navigate('Details', { weatherData });
  };
  /////////////////////////////////////////
  const [loaded] = useFonts({
    'weather': require('./assets/fonts/Weather.otf'),
  });
  /////////////////////////////////////////
  if (!loaded) {
    return null;
  }
  /////////////////////////////////////////
  return (
    <View style={{flex: 1,
      backgroundColor: '#F5FCFF', textAlign:'center', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {weatherData === null && (
        <Animated.View style={{ alignItems: 'center', marginBottom: 50, marginTop: 20 }}>
          <Animated.Text style={{ fontSize: 39, fontFamily: 'Exo-Bold', marginBottom: 20, transform: [{ scale: pulseAnim }] }}>WEATHER APP </Animated.Text>
        </Animated.View>
      )}
      <Autocomplete
        data={citySuggestions}
        defaultValue={city}
        onChangeText={handleQueryChange}
        renderItem={renderSuggestions}
        containerStyle={{ width: '80%', maxHeight: 300, marginBottom: 20 }}
        listStyle={{ marginTop: 2 }}
        placeholder="Enter a city name"
        value={city}
      />
      {!isInputEmpty && !isSearchPressed && (
        <TouchableHighlight
          underlayColor="#ff0000"
          style={{ borderWidth: 2, borderColor: '#ff0000', borderRadius: 10, overflow: 'hidden', position: 'absolute', top: 220, width: '80%' }}
          onPress={fetchWeatherData}
        >
          <View style={{ backgroundColor: '#ff0000', padding: 15, height: 60 }}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontWeight: 'bold', fontSize: 20, color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 2 }}>Search</Text>
          </View>
        </TouchableHighlight>
      )}
      {weatherData && (
        <Animated.View style={{ alignItems: 'center', marginTop: 20, opacity: opacityAnim }}>
          <Flag
            code={weatherData.sys.country}
            size={48}
            style={{ marginBottom: 20 }}
          />
          <Text style={{ fontSize: 40, fontFamily: 'Exo-Bold' }}>{weatherData.name}</Text>
          <Animated.Text style={{ fontSize: 60, fontFamily: 'Exo-Bold', marginTop: 10, transform: [{ scale: pulseAnim }] }}>{weatherData.main.temp}°C <Image source={require('./assets/icons/hot.png')} style={{ width: 80,height: 80 
}}  /></Animated.Text>
          <Button
            title="Show more details"
            onPress={handleShowDetails}
            buttonStyle={{ backgroundColor: '#00bfff', padding: 15, height: 60, width: 320, marginTop: 30 }}
            titleStyle={{ textAlign: 'center', textAlignVertical: 'center', fontFamily: 'Exo-Bold', fontSize: 20 }}
          />
        </Animated.View>
      )}
    </View>
  );
};
  /////////////////////////////////////////\
export default HomeScreen;
