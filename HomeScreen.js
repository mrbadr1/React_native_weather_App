
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Keyboard } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { Button, Input } from 'react-native-elements';
import Flag from 'react-native-flags';
import DropDownPicker from 'react-native-dropdown-picker';

const API_WEATHER_KEY = 'YOUR_WHEATERMAP_API_KEY_HERE';
const API_GOOGLE_KEY = 'YOUR_GOOGLE_API_KEY_HERE';

const HomeScreen = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [isSearchPressed, setIsSearchPressed] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchCitySuggestions = async (text) => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&key=${API_GOOGLE_KEY}`);
        const citySuggestions = response.data.predictions.map(prediction => ({ label: prediction.structured_formatting.main_text, value: { city: prediction.structured_formatting.main_text, country: prediction.structured_formatting.secondary_text } }));
        setCitySuggestions(citySuggestions);
        console.log(citySuggestions);
      } catch (error) {
        console.error(error);
      }
    };

    if (city.length > 0) {
      fetchCitySuggestions(city);
    }
  }, [city]);

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

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_WEATHER_KEY}&units=metric`);
      setWeatherData(response.data);
      setCitySuggestions([]);
      Keyboard.dismiss(); // Hide the keyboard
      setIsSearchPressed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityPress = (cityObj) => {
    setCity(cityObj.city);
    setWeatherData(null);
    setCitySuggestions([]);
  };

  const handleClearInput = () => {
    setCity('');
    setWeatherData(null);
    setCitySuggestions([]);
  };

  const renderCityItem = ({ item, index }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Flag
          code={item.value.country}
          size={60}
          style={{ marginRight: 10 }}
        />
        <Text>{item.label}</Text>
      </View>
    );
  };

  useEffect(() => {
    setIsInputEmpty(city === '');
    if (city === '') {
        setIsSearchPressed(false);
      setWeatherData(null);
    }
  }, [city]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (city !== '' && weatherData !== null) {
        fetchWeatherData();
      }
    }, 60000); // Fetch weather data every minute

    return () => clearInterval(intervalId);
  }, [city, weatherData]);

  const handleShowDetails = () => {
    navigation.navigate('Details', { weatherData });
  };

  const handleSelectCity = (item) => {
    setCity(item.value.city);
    setCitySuggestions([]);
  };

  const [loaded] = useFonts({
    'weather': require('./assets/fonts/Weather.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {weatherData === null && (
        <View style={{ alignItems: 'center', marginBottom: 50, marginTop: 30 }}>
          <Animated.Text style={{ fontSize: 50, fontWeight: 'bold', fontFamily: 'weather', marginBottom: 20, transform: [{ scale: pulseAnim }] }}>Weather App </Animated.Text>
        </View>
      )}
      <Input
        placeholder="Search for a city"
        onChangeText={text => {
          setCity(text);
        }}
        value={city}
        containerStyle={{ width: '80%', marginBottom: 20, alignItems: 'center', borderWidth: 2, borderColor: isFocused ? '#00bfff' : '#ccc', borderRadius: 10, padding: 10, boxShadow: isFocused ? '0 0 10px #00bfff' : 'none' }}
        inputStyle={{ fontWeight: 'bold', textAlign: 'center' }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClear={handleClearInput}
        underlineColorAndroid='transparent'
        placeholderStyle={{ color: 'transparent' }}
      />
      {citySuggestions.length > 0 && (
        <DropDownPicker
          items={citySuggestions.map(suggestion => ({ label: suggestion.label, value: suggestion.value }))}
          searchable={true}
          onChangeItem={handleSelectCity}
          containerStyle={{ width: '80%', maxHeight: 200, marginBottom: 20 }}
          zIndex={99999}
          placeholder="cities suggestions list"
          renderItem={renderCityItem}
          dropDownContainerStyle={{ marginTop: 2 }}
        />
      )}
      {!isInputEmpty && !isSearchPressed && (
        <Button
          title="Search"
          onPress={fetchWeatherData}
          buttonStyle={{ backgroundColor: '#00bfff', padding: 15, height: 60, width: 320 }}
          titleStyle={{ textAlign: 'center', textAlignVertical: 'center', fontWeight: 'bold', fontSize: 20 }}
        />
      )}
      {weatherData && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Flag
            code={weatherData.sys.country}
            size={48}
            style={{ marginBottom: 20 }}
          />
          <Text style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'Exo-Bold' }}>{weatherData.name}</Text>
          <Animated.Text style={{ fontSize: 80, fontWeight: 'bold', fontFamily: 'Exo-Bold', marginTop: 20, transform: [{ scale: pulseAnim }] }}>{weatherData.main.temp}°C</Animated.Text>
          <Button
            title="Show more details"
            onPress={handleShowDetails}
            buttonStyle={{ backgroundColor: '#00bfff', padding: 15, height: 60, width: 320, marginTop: 20 }}
            titleStyle={{ textAlign: 'center', textAlignVertical: 'center', fontWeight: 'bold', fontSize: 20 }}
          />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
