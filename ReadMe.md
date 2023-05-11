Necessary packages :

  ## Weather App
  -------------------

This is a React Native weather application that allows users to search for the current weather in a specified city. The app uses the OpenWeather API to fetch weather data and the Google Places API to provide autocomplete suggestions as the user types in the search field.

Features

Search for weather by city name
Autocomplete suggestions
Display current temperature, weather condition, and country flag
Animated pulse effect when the app is launched
Display a message when no weather data is available
Navigate to a details page for more information

## screenshot 

![](https://github.com/Your_Repository_Name/Your_GIF_Name.gif)

Getting started

Prerequisites

Before you begin, make sure you have the following installed:

Node.js
Expo CLI
Yarn

## Install
     $npm install expo-font @react-navigation/native @react-navigation/stack axios react-native-elements react-native-flags react-native-autocomplete-input react-native-dropdown-picker react-native-maps
     
## expo runtime
     
     $expo install react-native-reanimated@2.14.4

## Usage
Clone this repository to your local machine
Open a terminal in the project directory and run yarn install to install dependencies
Create a .env file in the project root directory and add your OpenWeather and Google Places API keys as follows:
---------------------------




----------------------------
API_WEATHER_KEY=<your OpenWeather API key>
  
API_GOOGLE_KEY=<your Google Places API key>
  
Run the app
  
expo start or yarn start
  
Usage
Enter the name of the city you want to check the weather for in the search field
Select the desired city from the autocomplete suggestions
Press the search button to fetch and display the weather data
Press the details button to navigate to the details page
  
Dependencies
  
axios: "^0.23.0"
expo: "^42.0.0"
expo-font: "^10.0.4"
react: "17.0.2"
react-native: "0.64.2"
react-native-autocomplete-input: "^4.2.0"
react-native-dropdown-picker: "^6.0.12"
react-native-elements: "^3.4.2"
react-native-flags: "^1.1.2"
react-native-gesture-handler: "^1.10.3"
react-native-reanimated: "^2.2.0"
react-native-safe-area-context: "^3.2.0"
react-native-screens: "^3.6.0"
react-native-svg: "^12.1.1"
  
Authors
  
Mrbadr1
  
License
  
This project is licensed under the MIT License - see the LICENSE file for details.
