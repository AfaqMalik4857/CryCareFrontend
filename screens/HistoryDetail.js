import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import BackToHome from "../components/BackToHome";

const HistoryDetail = ({ route, navigation }) => {
  const { date, time, status, recordingNo, icon } = route.params;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />

      <Text style={styles.header}>
        {date} {time}
      </Text>
      <View style={styles.detailContainer}>
        <View style={styles.iconWrapper}>
          <Icon name={icon} size={50} color="#4c8bf5" />
        </View>
        <Text style={styles.statusText}>{status}</Text>
        <Text style={styles.subText}>{recordingNo}</Text>
        <Text style={styles.percentageText}>Angry: 89.3%</Text>
        <Text style={styles.percentageText}>Uncomfortable: 10.7%</Text>
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#fff", marginLeft: 30 }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },

  backButton: {
    backgroundColor: "#2c709e",
    borderRadius: 20,
    marginTop: 20,
    marginLeft: 140,
    height: "5%",
    justifyContent: "center",

    width: "30%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 200,
    color: "#333",
  },
  detailContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#d7e8f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b81",
  },
  subText: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  percentageText: {
    fontSize: 18,
    color: "#4c8bf5",
    marginVertical: 5,
  },
  registerButton: {
    marginTop: 30,
    backgroundColor: "#ff6b81",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HistoryDetail;
