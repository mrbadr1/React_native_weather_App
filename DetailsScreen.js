import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const API_GOOGLE_KEY = 'AIzaSyCubdQAjDXz94wPw0WyIEUzRf9GKWUAovw';

const DetailsScreen = ({ route }) => {
  const { weatherData } = route.params;
  const [cityDetails, setCityDetails] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

  const fetchPlaceId = async (query) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${API_GOOGLE_KEY}`);
      const placeId = response.data.candidates[0].place_id;
      return placeId;
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((currentPhotoIndex + 1) % cityDetails.photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((currentPhotoIndex - 1 + cityDetails.photos.length) % cityDetails.photos.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{weatherData.weather[0].description}</Text>
        <View style={styles.tempContainer}>
          <Text style={styles.tempText}>{weatherData.main.temp_min}°C</Text>
          <Text style={[styles.tempText, { marginLeft: 20 }]}>{weatherData.main.temp_max}°C</Text>
        </View>
        <Text style={styles.humidityText}>Humidity: {weatherData.main.humidity}%</Text>
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
          <Text style={styles.detailsText}>{cityDetails.formatted_address}</Text>
          <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={{
              latitude: cityDetails.geometry.location.lat,
              longitude: cityDetails.geometry.location.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
              <Marker coordinate={{
                latitude: cityDetails.geometry.location.lat,
                longitude: cityDetails.geometry.location.lng,
              }} />
            </MapView>
          </View>
        </View>
      )}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Position: {cityDetails && cityDetails.formatted_address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 30,
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
  humidityText: {
    fontSize: 16,
    fontFamily: 'Exo-Bold',
    marginTop: 2,
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  slideshowContainer: {
    position: 'relative',
    width: Dimensions.get('window').width,
    height: 300,
  },
  image: {
    width: Dimensions.get('window').width,
    height: 300,
    borderRadius: 10,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  slideshowControlText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
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
});

export default DetailsScreen;
