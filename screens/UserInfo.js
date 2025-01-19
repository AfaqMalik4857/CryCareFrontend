import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";

const UserInfo = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const { name, gender, email, password } = state?.user || {};

  // Helper function to create a masked password
  const maskedPassword = (password) => {
    return password ? "•".repeat(password.length) : "";
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["transparent", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <View style={{ flexDirection: "row", marginBottom: moderateScale(120) }}>
        <TouchableOpacity
          style={{
            marginLeft: moderateScale(20),
            marginTop: verticalScale(65),
          }}
          onPress={() => navigation.navigate("Account")}
        >
          <Icon name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>

        <Image
          source={require("../assets/crycarelogo.png")}
          style={styles.logo}
        />
      </View>

      <View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 25 }}>User Information</Text>
        </View>

        {/* Display User Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Name: {name}</Text>
          <Text style={styles.infoText}>Gender: {gender}</Text>
          <Text style={styles.infoText}>Email: {email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: moderateScale(800),
  },
  logo: {
    width: moderateScale(200),
    height: moderateScale(53),
    alignSelf: "flex-start",
    marginTop: verticalScale(50),
    marginLeft: moderateScale(10),
  },
  infoContainer: {
    marginTop: verticalScale(20),
    padding: moderateScale(12),
  },
  infoText: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(20),
    fontWeight: "600",
    backgroundColor: "#fff",
    height: moderateScale(40),
    borderRadius: moderateScale(5),
    paddingTop: verticalScale(7),
    paddingLeft: moderateScale(8),
  },
});

export default UserInfo;
