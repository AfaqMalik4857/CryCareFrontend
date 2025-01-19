import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/FooterMenu";
import Icon from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";

const Account = ({ navigation }) => {
  const [state] = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("Login");
        },
      },
    ]);
  };

  const handleUpdateProfile = () => {
    navigation.navigate("Update Profile");
  };
  const TermOfUse = () => {
    navigation.navigate("Term of use");
  };
  const PrivacyPolicy = () => {
    navigation.navigate("Privacy Policy");
  };

  const ContactUs = () => {
    navigation.navigate("Contact Us");
  };

  const About = () => {
    navigation.navigate("About");
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../assets/profileimage.png")}
          style={{
            height: moderateScale(90),
            width: moderateScale(90),
            borderRadius: moderateScale(45),
            marginTop: verticalScale(50),
          }}
        />
        <Text
          style={{ marginTop: verticalScale(10), fontSize: moderateScale(25) }}
        >
          {state?.user.name}
        </Text>
      </View>

      {/* Update Profile Button */}
      <View style={{ flex: 1, marginTop: verticalScale(45) }}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}
        >
          <Icon name="create-outline" size={moderateScale(24)} color="black" />
          <Text style={styles.updateText}>Update Profile</Text>
          <Icon
            name="chevron-forward-outline"
            size={moderateScale(24)}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate("User Info")}
        >
          <Icon
            name="information-circle-outline"
            size={moderateScale(24)}
            color="black"
          />
          <Text
            style={{
              marginLeft: moderateScale(8),
              fontSize: moderateScale(16),
              color: "black",
              fontWeight: "bold",
              marginRight: moderateScale(220),
            }}
          >
            User Info
          </Text>
          <Icon
            name="chevron-forward-outline"
            size={moderateScale(24)}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={TermOfUse}>
          <Icon
            name="clipboard-outline"
            size={moderateScale(24)}
            color="black"
          />
          <Text
            style={{
              marginLeft: moderateScale(8),
              fontSize: moderateScale(16),
              color: "black",
              fontWeight: "bold",
              marginRight: moderateScale(187),
            }}
          >
            Terms of Use
          </Text>
          <Icon
            name="chevron-forward-outline"
            size={moderateScale(24)}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={PrivacyPolicy}>
          <Icon
            name="lock-closed-outline"
            size={moderateScale(24)}
            color="black"
          />
          <Text
            style={{
              marginLeft: 8,
              fontSize: moderateScale(16),
              color: "black",
              fontWeight: "bold",
              marginRight: moderateScale(166),
            }}
          >
            Privacy & Policy
          </Text>
          <Icon
            name="chevron-forward-outline"
            size={moderateScale(24)}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton} onPress={About}>
          <Icon
            name="information-outline"
            size={moderateScale(24)}
            color="black"
          />
          <Text
            style={{
              marginLeft: 8,
              fontSize: moderateScale(16),
              color: "black",
              fontWeight: "bold",
              marginRight: moderateScale(246),
            }}
          >
            About
          </Text>
          <Icon
            name="chevron-forward-outline"
            size={moderateScale(24)}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactusButton} onPress={ContactUs}>
          <Icon
            name="person-circle-outline"
            size={moderateScale(24)}
            color="black"
          />
          <Text
            style={{
              marginLeft: moderateScale(8),
              fontSize: moderateScale(16),
              color: "black",
              fontWeight: "bold",
              marginRight: moderateScale(205),
            }}
          >
            Contact Us
          </Text>
          <Icon
            name="chevron-forward-outline"
            size={moderateScale(24)}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={moderateScale(24)} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.version}>
        <Text
          style={{
            fontSize: moderateScale(16),
            color: "black",
            fontWeight: "bold",
          }}
        >
          Version
        </Text>
        <Text style={styles.version}>1.2.1</Text>
      </View>

      <FooterMenu />
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
    height: verticalScale(800),
  },
  updateButton: {
    flexDirection: "row",
    marginLeft: moderateScale(10),
    marginTop: moderateScale(2),
    marginBottom: verticalScale(20),
  },
  version: {
    marginLeft: moderateScale(10),
    marginBottom: verticalScale(20),
    alignItems: "center",
    alignSelf: "center",
    textAlign: "center",
    alignContent: "center",
  },
  contactusButton: {
    flexDirection: "row",
    marginLeft: moderateScale(10),
    marginTop: verticalScale(2),
    marginBottom: verticalScale(20),
  },
  updateText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    color: "black",
    fontWeight: "bold",
    marginRight: moderateScale(180),
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(10),
    backgroundColor: "#2c709e",
    borderRadius: moderateScale(25),
    alignSelf: "center",
    marginBottom: verticalScale(10),
  },
  logoutText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Account;
