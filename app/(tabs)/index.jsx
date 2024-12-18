import React, { useRef, useEffect, useState } from 'react';
import { Image, StyleSheet, Animated, Text, Easing, TouchableOpacity, View } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import backgroundImage from '../../assets/images/bg.jpg';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    Bungee: require("../../assets/fonts/BungeeInline-Regular.ttf"),
  });

  const sportsAnim = useRef(new Animated.Value(-200)).current; // Start off-screen to the left
  const fightAnim = useRef(new Animated.Value(200)).current; // Start off-screen to the right
 
  const sportsOpacity = useRef(new Animated.Value(0)).current;
  const fightOpacity = useRef(new Animated.Value(0)).current;

  const [showPlayButton, setShowPlayButton] = useState(false);

  const playButtonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(sportsAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(sportsOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fightAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(fightOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setShowPlayButton(true); // Show play button after animations
      setTimeout(() => {
        Animated.timing(playButtonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1000);
    });
  }, [sportsAnim, fightAnim, sportsOpacity, fightOpacity]);

  return (
    <ThemedView style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <View style={styles.titleContainer}>
        <Animated.Text
          style={[
            styles.text,
            { transform: [{ translateX: sportsAnim }], opacity: sportsOpacity },
          ]}
        >
          FUTBOL
        </Animated.Text>
        <Animated.Text
          style={[
            styles.text,
            { transform: [{ translateX: fightAnim }], opacity: fightOpacity },
          ]}
        >
          FIGHT
        </Animated.Text>
      </View>
      {showPlayButton && (
        <Animated.View style={[styles.playButtonContainer, { opacity: playButtonOpacity }]}>
          <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('picker')}>
            <Text style={styles.playButtonText}>PLAY!</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBotton: 10,
    color: 'white',
    fontFamily: 'Bungee',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -5, height: 5 },
    textShadowRadius: 5,
  },
  playButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  playButtonText: {
    color: 'black',
    fontFamily: 'Bungee',
    fontSize: 48
  },  
  titleContainer: {
    position: 'absolute',
    top: '25%', // Adjust this value to position the text in the top third
    alignItems: 'center',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: 100, // Adjust as needed
    alignSelf: 'center',
  },
});
