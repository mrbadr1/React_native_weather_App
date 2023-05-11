import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Keyboard, Animated, TouchableHighlight, Image } from 'react-native';
import { API_GOOGLE_KEY, API_WEATHER_KEY } from './API_KEYS';
import { useFonts } from 'expo-font';
import { Button } from 'react-native-elements';
import Flag from 'react-native-flags';
import axios from 'axios';
const HomeScreen = ({ navigation }) => { 
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [isSearchPressed, setIsSearchPressed] = useState(false);
  const [opacityAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  const fetchCitySuggestions = async (text) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${API_GOOGLE_KEY}`);
     
      const citySuggestions = response.data.predictions.map(prediction => ({
        label: prediction.structured_formatting.main_text.toString(),
        value: { city: prediction.structured_formatting.main_text, country: prediction.structured_formatting.secondary_text },
        id: prediction.place_id,
      }));      
      setCitySuggestions(citySuggestions);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityChange = (text) => {
    setCity(text);
    fetchCitySuggestions(text);
  };

  const handleCitySelect = (city) => {
    setCity(city.label);
    setCitySuggestions([]);
  };

  const renderCityItem = ({ item }) => (
 <View>
 <View style={{ borderRadius:20,textAlign:"center",backgroundColor:"#BBB",marginTop:2 }}><Text onPress={() => handleCitySelect(item)} style={{ alignItems: 'center',
    fontSize: 20,fontFamily: 'Exo-Bold',left:5
   }}>{item.label}</Text></View>
</View>
    
  );

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_WEATHER_KEY}&units=metric`);
      setWeatherData(response.data);
      setCitySuggestions([]);
      Keyboard.dismiss();
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

  useEffect(() => {
    setIsInputEmpty(city === '');
    if (city === '') {
      setIsSearchPressed(false);
      setWeatherData(null);
      setCitySuggestions([]);
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [city]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (city !== '' && weatherData !== null) {
        fetchWeatherData();
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, [city, weatherData]);

  const handleShowDetails = () => {
    navigation.navigate('Details', { weatherData });
  };
  
  const [loaded] = useFonts({
    'weather': require('./assets/fonts/Weather.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
<View style={{ position: 'absolute', top: 50, left: 0, right: 0, alignItems: 'center' }}>
  <TextInput 
    placeholder="Enter city name"
    placeholderTextColor="#ccc"
    value={city}
    onChangeText={handleCityChange}
    style={{ backgroundColor: '#fff', padding: 15, borderRadius: 20, width: '80%', fontSize: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 ,textAlign: 'center'}}
  />
</View>

{!isInputEmpty && !isSearchPressed && (
<View style={{ position: 'absolute', top: 250,}}>
    <Button
    title="SEARCH"
    onPress={fetchWeatherData}
    buttonStyle={{ backgroundColor: '#00bfff', padding: 15, height: 60, width: 320, borderRadius: 20,shadowColor: '#000'}}
    titleStyle={{ fontSize: 18 }}
  />
  </View>
        )}
<View style={{ position: 'absolute', top: 112,left: 0, right: 0 ,alignItems: 'center'}}>
{citySuggestions.length > 0 && (
  <FlatList
    data={citySuggestions}
    renderItem={renderCityItem}
    keyExtractor={(item) => item.id}
    style={{ borderWidth: 3, borderColor: '#ccc', borderRadius: 20, width: '90%',backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, width: '80%' }}
    contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5 }}
  />
)}
</View>
        <View>

      {weatherData && (

      
        <Animated.View style={{ alignItems: 'center', marginTop: 30, opacity: opacityAnim }}>
                 <View style={{ alignItems: 'center',
         backgroundColor: '#fff',
         borderRadius:30,
         flexDirection: 'column',
         alignItems: 'center',
         justifyContent: 'center',
         width: '100%',
        }}>
          <Flag
            code={weatherData.sys.country}
            size={48}
          />
          <Text style={{ fontSize: 40, fontFamily: 'Exo-Bold' }}>{weatherData.name}</Text>
          <Animated.Text style={{ fontSize: 50, fontFamily: 'Exo-Bold', marginTop: 5, transform: [{ scale: pulseAnim }] }}>{Math.round(weatherData.main.temp)}°C <Image source={require('./assets/icons/hot.png')} style={{ width: 40, height: 40 }} /></Animated.Text>
          </View>
          <Button
            title="Show more details"
            onPress={handleShowDetails}
            buttonStyle={{ borderRadius:30, backgroundColor: '#00bfff', padding: 15, height: 60, width: 320, marginTop: 30 }}
            titleStyle={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 20 }}
          />
        </Animated.View>
      )}
      </View>
    </View>
  );
};
export default HomeScreen;
