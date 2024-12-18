import React, { useState , useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { ThemedView } from '@/components/ThemedView';
import backgroundImage from '../../assets/images/bg.jpg';
import futbolData from '../../data/futbol.json';
import { useFocusEffect } from '@react-navigation/native';

const leagues = futbolData.leagues.map(league => league.name);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
const currentDecadeStart = Math.floor(currentYear / 10) * 10;
const decades = Array.from({ length: (currentDecadeStart - 1920) / 10 + 1 }, (_, i) => `${currentDecadeStart - i * 10}s`);

export default function SportsPicker() {
  const [fontsLoaded] = useFonts({
    Bungee: require("../../assets/fonts/BungeeInline-Regular.ttf"),
  });

  useFocusEffect(
    React.useCallback(() => {
      setGameStep(1);
      setSelectedLeague(null);
      setSelectedTeam(null);
      setSelectedYear(null);
      setSelectedDecade(null);
      setTopic(null);
    }, [])
  );


  const getTopic = async (entry1, entry2, entry3, entry4) => {


    const randomString = Math.random().toString(36).substring(7);

    const topicEndpoint = "futbolfight.php";

    try {
      const response = await fetch(
        `${apiUrl}/${topicEndpoint}?league=${entry1}&team=${entry2}&year=${entry3}&decade=${entry4}&cacheBuster=${randomString}`
      );
      const result = await response.text();
      setTopic(result);
      setGameStep(5);
    } catch (error) {
      console.error("Error fetching winner:", error);
    }
  };

  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDecade, setSelectedDecade] = useState(null); 
  const [gameStep, setGameStep] = useState(1);
  const [topic, setTopic] = useState(null);
  if (!fontsLoaded) {
    return null; // Optionally, you can return a loading indicator here
  }



  const renderItem = ({ item, type }) => {
    const isSelected =
      (type === 'league' && item === selectedLeague) ||
      (type === 'year' && item === selectedYear) ||
      (type === 'decade' && item === selectedDecade) ||
      (type === 'team' && item === selectedTeam);

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => {
          if (type === 'league') setSelectedLeague(item);
          if (type === 'year') {
            setSelectedYear(item);
            setSelectedDecade(null);
          }
          if (type === 'decade') {
            setSelectedDecade(item);
            setSelectedYear(null);
          }
          if (type === 'team') setSelectedTeam(item);
        }}
      >
        <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const getTeamsForSelectedLeague = () => {
    const league = futbolData.leagues.find(l => l.name === selectedLeague);
    return league ? ["All", ...league.teams] : [];
  };

  return (
    <ThemedView style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      {gameStep === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Pick a league</Text>
          <View style={styles.listContainer}>
            <FlatList
              data={leagues}
              renderItem={({ item }) => renderItem({ item, type: "league" })}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setGameStep(2)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {gameStep === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Pick a team</Text>
          <View style={styles.listContainer}>
            <FlatList
              data={getTeamsForSelectedLeague()}
              renderItem={({ item }) => renderItem({ item, type: "team" })}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setGameStep(1)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setGameStep(3)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {gameStep === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Pick a year</Text>
          <View style={styles.smallListContainer}>
            <FlatList
              data={years}
              renderItem={({ item }) => renderItem({ item, type: "year" })}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          </View>
          <Text style={styles.orText}>or decade</Text>
          <View style={styles.smallListContainer}>
            <FlatList
              data={decades}
              renderItem={({ item }) => renderItem({ item, type: "decade" })}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setGameStep(2)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setGameStep(4)}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {gameStep === 4 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>You have chosen:</Text>
          <Text style={styles.chosenText}>
            {selectedTeam ? selectedTeam : selectedLeague}{" "}
            {selectedYear || selectedDecade}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => getTopic(selectedLeague, selectedTeam, selectedYear, selectedDecade)}>
              <Text style={styles.buttonText}>FIGHT!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {gameStep === 5 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>{topic}</Text>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    height: "100%",
  },
  chosenText: {
    fontSize: 48,
    color: "white",
    fontFamily: "Bungee",
    textAlign: "center",
    marginTop: "10%",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  stepContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "80%",
    marginTop: "10%",
    marginBottom: "20%",  
  },
  title: {
    fontSize: 24,
    color: "white",
    fontFamily: "Bungee",
    marginVertical: 10,
  },
  listContainer: {
    height: "65%", // Adjust as needed to fit design
    width: "80%", // Adjust as needed to fit design
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  smallListContainer: {
    height: "30%", // Adjust as needed to fit design
    width: "80%", // Adjust as needed to fit design
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  list: {
    paddingVertical: 20,
  },
  item: {
    backgroundColor: "#ff6347",
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "blue",
  },
  button: {
    backgroundColor: "#ff6347",
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    color: "white",
    fontFamily: "Bungee",
  },
  itemText: {
    fontSize: 24,
    color: "white",
    fontFamily: "Bungee",
  },
  orText: {
    fontSize: 24,
    color: "white",
    fontFamily: "Bungee",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Bungee',
  },
});