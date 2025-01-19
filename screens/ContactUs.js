import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ContactUs = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [name, setName] = useState(state?.user.name || "");
  const [email, setEmail] = useState(state?.user.email || "");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!name || !email || !comment) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!validateInputs()) return;

    try {
      setLoading(true);
      // Send comment to your backend
      const response = await axios.post(`http://${baseIP}:8080/comments`, {
        name,
        email,
        comment,
      });
      Alert.alert("Success", response.data.message);
      // Clear inputs
      setName("");
      setEmail("");
      setComment("");
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an issue sending your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "baseline" }}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>
            If you have any questions or queries, you can contact us.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, styles.commentInput]}
            placeholder="Write a comment here"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            style={styles.SubmitButton}
            onPress={() => navigation.navigate("Account")}
            disabled={loading}
          >
            <Icon name="arrow-back-outline" size={24} color="#fff" />
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.SubmitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.SubmitText}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  commentInput: {
    height: verticalScale(100),
    textAlignVertical: "top",
  },
  title: {
    marginTop: verticalScale(60),
    marginBottom: verticalScale(5),
    fontSize: moderateScale(25),
    marginLeft: moderateScale(10),
  },
  subtitle: {
    marginTop: verticalScale(5),
    marginBottom: verticalScale(15),
    fontSize: moderateScale(15),
    color: "gray",
    margin: moderateScale(10),
  },
  SubmitButton: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#2c709e",
    borderRadius: moderateScale(25),
    marginTop: verticalScale(60),
    alignSelf: "center",
  },
  SubmitText: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "bold",
    width: moderateScale(50),
    textAlign: "center",
  },
});

export default ContactUs;
