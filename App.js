import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ImageBackground } from 'react-native';

export default function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [showTitle, setShowTitle] = useState(true);

  const API_KEY = "628d0334f5104737845231611241902";

  const getWeather = async () => {
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=yes&alerts=no`);
      const data = await res.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError("Error finding weather data");
    }
  };

  const getBackgroundImage = () => {
    if (!weatherData || !weatherData.current || !weatherData.current.condition || !weatherData.current.condition.text) {
      return require('./background/default.jpg');
    }

    const { current } = weatherData;
    const { text } = current.condition;

    if (text.includes('rain') || text.includes('drizzle') || text.includes('Drizzle')) return require('./background/rainy.jpg');
    if (text.includes('cloudy') || text.includes('Cloudy')) return require('./background/cloudy.jpg');
    if (text.includes('thunderstorm')) return require('./background/stormy.jpg');
    if (text.includes('clear') || text.includes('Sunny')) return require('./background/sunny.jpg');
    if (text.includes('snow') || text.includes('Snow')) return require('./background/snowy.jpg');

    return require('./background/default.jpg');
  };

  const handlePress = () => {
    setShowTitle(false);
    getWeather();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ImageBrightnessContainer brightness={2}> 
      <ImageBackground source={getBackgroundImage()} style={styles.container}>
        <View style={styles.overlay}>
          {showTitle && <Text style={styles.title}>Welcome to: Weather App!</Text>}
          {weatherData && (
            <View style={styles.weatherContainer}>
              <Text style={styles.title2}>{weatherData.location.name}, {weatherData.location.country}.</Text>
              <Text style={styles.temperature}>{weatherData.current.temp_c}°C</Text>
              <Text style={styles.condition}> In this moment the weather is: {weatherData.current.condition.text}.</Text>
            </View>
          )}

          <TextInput
            style={styles.textInput}
            placeholder='Enter city name'
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Get Weather</Text>
          </TouchableOpacity>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </ImageBackground>
      </ImageBrightnessContainer>
    </KeyboardAvoidingView>
  );
}

const ImageBrightnessContainer = ({ brightness, children }) => {
  const containerStyles = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    brightness: brightness,
  };

  return <View style={containerStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center", 
    resizeMode: "cover", 
    flex: 1,
    width:"100%",
    height: "100%"

  },

  overlay: {
    flex: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#093961",
    textAlign: "center",
    padding: 10,
    marginBottom: 20
  },
  textInput: {
    backgroundColor: "#E7F3FC",
    borderRadius: 15,
    height: 50,
    width: "88%",
    padding: 15,
    marginBottom: 30,
    fontSize: 15
  },
  button: {
    backgroundColor: "#ED9A7C",
    padding: 15,
    margin: 5,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 28
  },
  temperature: {
    color: "white",
    fontSize: 120,
    marginBottom: 20,
    alignSelf: "center",
    textAlign: "center"
  },
  condition: {
    color: "#9af9ff",
    fontSize: 18,
    marginBottom: 20, 
    textAlign: "center"
  },
  weatherContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },
  title2: {
    color: "white",
    fontSize: 35,
    marginBottom: 30, 
    textAlign: "center"
  },
  error: {
    color: '#CC0000',
    marginBottom: 10,
  },
});
