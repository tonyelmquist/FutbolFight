import React, { useRef, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Animated,
  Text,
  Easing,
  TouchableOpacity,
  Modal,
  Button,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { BannerAd } from "@/components/ads";
import backgroundImage from "../../assets/images/bg.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Bungee: require("../../assets/fonts/BungeeInline-Regular.ttf"),
  });

  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (!hasLaunched) {
        setShowPopup(true);
        await AsyncStorage.setItem("hasLaunched", "true");
      }
    };
    checkFirstLaunch();
  }, []);

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <Modal visible={showPopup} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              FUTBOL FIGHT! Pick a league or team, and a year or decade, and let
              FUTBOL FIGHT come up with something for you and your friends to
              argue about! It can tell you who is right, too! Now get ready to
              have a
            </Text>
            <Text style={styles.bigText}>FUTBOL FIGHT!</Text>
            <TouchableOpacity
              onPress={() => setShowPopup(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {fontsLoaded && (
        <View style={styles.titleContainer}>
          <Animated.Text
            style={[
              styles.text,
              {
                transform: [{ translateX: sportsAnim }],
                opacity: sportsOpacity,
              },
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
      )}
      {showPlayButton && (
        <Animated.View
          style={[styles.playButtonContainer, { opacity: playButtonOpacity }]}
        >
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate("picker")}
          >
            <Text style={styles.playButtonText}>PLAY!</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <View style={styles.adContainer}>
        <BannerAd />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 64,
    fontWeight: "bold",
    marginBotton: 10,
    color: "#FFF4E0",
    fontFamily: "Bungee",
    textShadowColor: "#000000",
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 8,
  },
  bigText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBotton: 10,
    color: "black",
    fontFamily: "Bungee",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -5, height: 5 },
    textShadowRadius: 5,
    textAlign: "center",
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: "#FFF4E0",
    padding: 10,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#003D29",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    width: "80%",
    height: "60%",
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: "10%",
    marginBottom: "10%",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Bungee",
    color: "#000000",
  },
  modalButtonText: {
    fontFamily: "Bungee",
    color: "white",
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    fontFamily: "Bungee",
    color: "black",
    fontSize: 16,
  },
  playButtonText: {
    color: "#003D29",
    fontFamily: "Bungee",
    fontSize: 48,
  },
  titleContainer: {
    position: "absolute",
    top: "12%",
    alignItems: "center",
    width: "100%",
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
    position: "absolute",
  },
  playButtonContainer: {
    position: "absolute",
    bottom: 160, // Adjust as needed
    alignSelf: "center",
  },
  adContainer: {
    position: "absolute",
    zIndex: 9999,
    bottom: 94,
    height: 50,
    width: "100%",
    alignItems: "center",
  },
});
