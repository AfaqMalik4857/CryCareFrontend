import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/FooterMenu";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const UpdateProfile = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [name, setName] = useState(state?.user.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState(state?.user.email);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // Prepare payload based on inputs
      const payload = { name, email };
      const isPasswordUpdate = oldPassword && newPassword;

      if (isPasswordUpdate) {
        payload.oldPassword = oldPassword;
        payload.newPassword = newPassword;
      }

      // Log the payload being sent
      console.log(payload);

      const { data } = await axios.put(`http://${baseIP}:8080/update`, payload);

      if (data.success) {
        if (isPasswordUpdate) {
          Alert.alert("Profile Updated", "Please Login.", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
        } else {
          Alert.alert(
            "Profile Updated",
            "Your name has been updated successfully."
          );
        }
      } else {
        Alert.alert("Update Failed", data.message || "Unknown error occurred.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "There was an error updating your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <View style={{ flexDirection: "row" }}>
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

      <ScrollView style={{ flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              marginTop: verticalScale(60),
              marginBottom: verticalScale(30),
              fontSize: moderateScale(25),
            }}
          >
            Update Profile
          </Text>
        </View>

        {/* Input Fields for Name and Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter New Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Old Password (optional)"
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password (optional)"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {/* Update Button */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.navigate("Account")}
            disabled={loading}
          >
            <Icon name="arrow-back-outline" size={24} color="#fff" />
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Icon name="checkmark-outline" size={24} color="#fff" />
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: moderateScale(200),
  },
  logo: {
    width: moderateScale(200),
    height: moderateScale(53),
    alignSelf: "flex-start",
    marginTop: verticalScale(50),
    marginLeft: moderateScale(10),
  },
  inputContainer: {
    marginTop: verticalScale(20),
  },
  input: {
    height: moderateScale(40),
    borderColor: "#ccc",
    borderRadius: scale(5),
    paddingHorizontal: moderateScale(10),
    marginBottom: verticalScale(15),
    margin: moderateScale(12),
    backgroundColor: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#2c709e",
    borderRadius: moderateScale(25),
    marginTop: verticalScale(60),
    alignSelf: "center",
  },
  updateText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "bold",
    width: moderateScale(60),
  },
  backButton: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "bold",
    width: moderateScale(70),
    textAlign: "center",
  },
});

export default UpdateProfile;
