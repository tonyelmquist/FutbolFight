import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import backgroundImage from "../../assets/images/bg.png";
import { todaysFeedUrl, APP_STORE_URL } from "@/constants/DailyDebates";

const CACHE_KEY = "dailyDebatesCache";

export default function DailyDebates() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Bungee: require("../../assets/fonts/BungeeInline-Regular.ttf"),
  });

  const [debates, setDebates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState({});

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const load = async () => {
        setLoading(true);
        try {
          const response = await fetch(todaysFeedUrl());
          if (!response.ok) throw new Error(`feed ${response.status}`);
          const feed = await response.json();
          if (cancelled) return;
          setDebates(feed.debates || []);
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(feed));
        } catch (error) {
          // Offline or no feed for today: fall back to the last cached day.
          try {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (!cancelled) setDebates(cached ? JSON.parse(cached).debates : []);
          } catch {
            if (!cancelled) setDebates([]);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      load();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const shareDebate = (debate) => {
    Share.share({
      message: `${debate.prompt}\n\nMy take: ${debate.hot_take}\n\nSettle it in FutbolFight! ${APP_STORE_URL}`,
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  const renderDebate = ({ item, index }) => (
    <View style={styles.card}>
      {!!item.league && item.league !== "evergreen" && (
        <Text style={styles.league}>{item.league}</Text>
      )}
      <Text style={styles.prompt}>{item.prompt}</Text>
      {revealed[index] ? (
        <Text style={styles.hotTake}>{item.hot_take}</Text>
      ) : (
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setRevealed({ ...revealed, [index]: true })}
        >
          <Text style={styles.smallButtonText}>Hot take</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.smallButton}
        onPress={() => shareDebate(item)}
      >
        <Text style={styles.smallButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <Text style={styles.title}>Today's Debates</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF4E0" />
      ) : debates && debates.length > 0 ? (
        <FlatList
          data={debates}
          renderItem={renderDebate}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          style={styles.listArea}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No debates today — start your own fight!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("picker")}
          >
            <Text style={styles.buttonText}>PLAY!</Text>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    color: "#FFF4E0",
    fontFamily: "Bungee",
    marginVertical: 10,
    textShadowColor: "#000000",
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 6,
  },
  listArea: {
    width: "90%",
  },
  list: {
    paddingVertical: 10,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
  },
  league: {
    fontSize: 12,
    color: "#ff6347",
    fontFamily: "Bungee",
    marginBottom: 6,
  },
  prompt: {
    fontSize: 20,
    color: "white",
    fontFamily: "Bungee",
    marginBottom: 10,
  },
  hotTake: {
    fontSize: 16,
    color: "#FFF4E0",
    fontFamily: "Bungee",
    fontStyle: "italic",
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 6,
  },
  smallButtonText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Bungee",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  emptyText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Bungee",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#000000",
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 6,
  },
  button: {
    backgroundColor: "#ff6347",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 120,
  },
  buttonText: {
    fontSize: 24,
    color: "white",
    fontFamily: "Bungee",
  },
});
