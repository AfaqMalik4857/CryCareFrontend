import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/FooterMenu";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const History = () => {
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);

  // Dummy history data
  const historyData = [
    {
      id: 1,
      time: "4:47 PM",
      date: "Oct 8, 2024",
      status: "Sleepy",
      recordingNo: "Recording 1",
      icon: "bed-outline",
    },
    {
      id: 2,
      time: "4:46 PM",
      date: "Oct 8, 2024",
      status: "Hungry",
      recordingNo: "Recording 3",
      icon: "nutrition-outline",
    },
    {
      id: 3,
      time: "4:45 PM",
      date: "Oct 8, 2024",
      status: "Hungry",
      recordingNo: "Recording 4",
      icon: "nutrition-outline",
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <Image
        source={require("../assets/crycarelogo.png")}
        style={styles.logo}
      />

      <ScrollView style={styles.historyContainer}>
        <Text style={styles.title}>History</Text>
        {historyData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate("HistoryDetail", item)}
            style={styles.historyItem}
          >
            <View style={styles.iconContainer}>
              <Icon name={item.icon} size={30} color="#4c8bf5" />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.dateText}>
                {item.date} {item.time}
              </Text>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
    backgroundColor: "#f9f9f9",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  logo: {
    width: 200,
    height: 53,
    alignSelf: "flex-start",
    marginTop: 50,
    marginLeft: 10,
  },
  historyContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#d7e8f5",
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: "#888",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4c8bf5",
  },
});

export default History;
