import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { API_GOOGLE_KEY, API_WEATHER_KEY } from './API_KEYS';

////////////////////////////////////////////////////////////////

const DetailsScreen = ({ route }) => {
  const { weatherData } = route.params;
  const [cityDetails, setCityDetails] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(null);

////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        const placeId = await fetchPlaceId(weatherData.name);
        const detailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,formatted_address,geometry&key=${API_GOOGLE_KEY}`);
        setCityDetails(detailsResponse.data.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCityDetails();
  }, [weatherData.name]);
/////////////////////////////////////////////////////
  useEffect(() => {
    const fetchCurrentTime = async () => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${cityDetails.geometry.location.lat},${cityDetails.geometry.location.lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${API_GOOGLE_KEY}`);
        const timestamp = Math.floor(Date.now() / 1000) + response.data.rawOffset + response.data.dstOffset - 3600; // subtract 1 hour
        setCurrentTime(new Date(timestamp * 1000).toLocaleTimeString());
      } catch (error) {
        console.error(error);
      }
    };
    if (cityDetails) {
      fetchCurrentTime();
      const intervalId = setInterval(fetchCurrentTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, [cityDetails]);
///////////////////////////////////////////////////
  const fetchPlaceId = async (query) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${API_GOOGLE_KEY}`);
      const placeId = response.data.candidates[0].place_id;
      return placeId;
    } catch (error) {
      console.error(error);
    }
  };
//////////////////////////////////////////////////
  const handleNextPhoto = () => {
    setCurrentPhotoIndex((currentPhotoIndex + 1) % cityDetails.photos.length);
  };
/////////////////////////////////////////////////
  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((currentPhotoIndex - 1 + cityDetails.photos.length) % cityDetails.photos.length);
  };
/////////////////////////////////////////////////
  return (
    <ScrollView>
          <View style={styles.header}>
           <View style={styles.containersquar1}>
           <View style={styles.container}>
             <Image source={{ uri: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png` }} style={styles.humidityIcon} />
             <Text style={styles.headerText}>{weatherData.weather[0].description}</Text>
           </View>
          <View style={styles.container}>
            <Text style={styles.tempText}>{weatherData.main.temp_min}°C</Text>
            <Text style={[styles.tempText, { marginLeft: 20 }]}>         {weatherData.main.temp_max}°C</Text>
          </View>
          </View>
          <View style={styles.containersquar2}>
          <View style={styles.container}>
            <Image source={require('./assets/icons/drop.png')} style={styles.Icondrop} />
            <Text style={styles.humidityText}>humidity: </Text>
            <Text style={styles.humidityText}>{weatherData.main.humidity}%</Text>
          </View>
          <View style={styles.container}>
               <Image source={require('./assets/icons/timeclock.gif')} style={{ width: 60,height: 60 }} />
               {currentTime && <Text style={styles.timeText}>
               {currentTime}</Text>}
          </View>
          </View>
        {cityDetails && (
          <View style={styles.detailsContainer}>
            <View style={styles.slideshowContainer}>
              <Image source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${cityDetails.photos[currentPhotoIndex].photo_reference}&key=${API_GOOGLE_KEY}` }} style={styles.image} />
              <View style={styles.slideshowControls}>
                <Text style={styles.slideshowControlText} onPress={handlePrevPhoto}>{'<'}</Text>
                <Text style={styles.slideshowControlText} onPress={handleNextPhoto}>{'>'}</Text>
              </View>
            </View>
            <View style={styles.mapContainer}>
              <MapView style={styles.map} initialRegion={{
                latitude: cityDetails.geometry.location.lat,
                longitude: cityDetails.geometry.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              </MapView>
            </View>
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Position: {cityDetails && cityDetails.formatted_address}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containersquar1: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  containersquar2: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    justifyontent: 'center',
    marginTop: 1,
    marginBottom: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Exo-Bold',
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tempText: {
    fontSize: 30,
    fontFamily: 'Exo-Bold',
  },
  humidityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  humidityIcon: {
    width: 100,
    height: 100,
  },
  Icondrop:{
    width: 40,
    height: 40,
  },
  humidityText: {
    fontSize: 16,
    fontFamily: 'Exo-Bold',
  },
  timeText: {
    fontSize: 25,
    fontFamily: 'Exo-Bold',
    marginTop: 2,
    marginBottom: 2,
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 1,
  },
  slideshowContainer: {
    position: 'relative',
    width: Dimensions.get('window').width-40,
    height: 300,
  },
  image: {
    width: Dimensions.get('window').width-40,
    height: 300,
    borderRadius: 39,
    
  },
  slideshowControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  slideshowControlText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFFB0D',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  detailsText: {
    fontSize: 16,
    fontFamily: 'Exo-Bold',
    marginTop: 20,
  },
  mapContainer: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    marginTop: 5,
    borderRadius: 10,
    overflow: 'hidden',
    borderRadius: 39,
  },
  map: {
    flex: 1,
    borderRadius: 39,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Exo-Bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    elevation: 5, // Add shadow effect
    borderRadius: 10, // Add rounded corners
    padding: 10, // Add padding
    margin: 10, // Add margin
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
});

export default DetailsScreen;
