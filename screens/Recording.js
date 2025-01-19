import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "../context/ApiInstance";
import { baseIP } from "../const";

const Recording = ({ navigation }) => {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [amplitude, setAmplitude] = useState(new Animated.Value(1));
  const [recordingActive, setRecordingActive] = useState(false);

  useEffect(() => {
    let interval;

    if (recording) {
      interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          const newAmplitude = Math.random(); // Simulated amplitude
          setAmplitude(newAmplitude);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [recording]);

  async function startRecording() {
    if (recording) return; // Prevent starting if already recording

    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recordingOptions = {
          android: {
            extension: ".m4a",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_M4A,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".m4a",
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
        };

        const { recording } = await Audio.Recording.createAsync(
          recordingOptions
        );
        setRecording(recording);
        setRecordingActive(true);
      } else {
        Alert.alert("Permission Denied", "You need to allow audio recording.");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Error", "Failed to start recording.");
    }
  }

  async function stopRecording() {
    if (!recording) return; // Prevent stopping if not recording

    try {
      await recording.stopAndUnloadAsync();
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const newRecording = {
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      };

      console.log("Recording URI:", recording.getURI()); // Debug: Check recording URI
      console.log("New Recording:", newRecording); // Debug: Check new recording object
      await uploadAudioToServer(recording.getURI());

      setRecordings((prevRecordings) => [...prevRecordings, newRecording]);
      setRecording(undefined);
      setAmplitude(new Animated.Value(1)); // Reset amplitude
      setRecordingActive(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to stop recording.");
    }
  }

  // Define the getDurationFormatted function here
  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return `${minutes} : ${String(seconds).padStart(2, "0")}`;
  }

  function clearRecording(index) {
    Alert.alert(
      "Delete Recording",
      "Are you sure you want to delete this recording?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            deleteRecording(index);
          },
        },
      ]
    );
  }

  async function uploadAudioToServer(fileUri) {
    const formData = new FormData();
    formData.append("audio", {
      uri: fileUri,
      type: "audio/m4a", // Adjust according to your file type
      name: "recording.m4a", // Use the actual filename
    });

    try {
      const response = await axios.post(
        `http://${baseIP}:8080/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading audio:", error);
      Alert.alert("Upload Failed", "Failed to upload audio.");
    }
  }
  async function deleteRecording(index) {
    const recordingToDelete = recordings[index];

    try {
      // Send DELETE request to the backend API
      await axios.delete(
        `/delete-audio/${recordingToDelete.file.split("/").pop()}`
      );

      // Update local state after successful deletion
      setRecordings((prevRecordings) => {
        const updatedRecordings = [...prevRecordings];
        updatedRecordings.splice(index, 1);
        return updatedRecordings;
      });
      Alert.alert(
        "Delete Recording",
        "Are you sure you want to delete this recording?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: () => {
              deleteRecording(index);
            },
          },
        ]
      );
      Alert.alert("Success", "Recording deleted successfully!");
    } catch (error) {
      console.error("Error deleting audio:", error);
      Alert.alert("Delete Failed", "Failed to delete audio.");
    }
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => (
      <View key={index} style={styles.row}>
        <TouchableOpacity onPress={() => deleteRecording(index)}>
          <Icon name="trash-sharp" style={styles.clearButton} />
        </TouchableOpacity>
        <Text style={styles.fill}>
          Recording # {index + 1} | {recordingLine.duration}
        </Text>
        <TouchableOpacity onPress={() => recordingLine.sound.replayAsync()}>
          <Icon name="play-circle-outline" style={styles.playButton} />
        </TouchableOpacity>
      </View>
    ));
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: startRecording,
    onPanResponderRelease: stopRecording,
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="arrow-back-outline" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.recordingText}>Recordings</Text>
      </View>

      {/* Animated Recording Amplitude Bar */}
      {recording && (
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.amplitudeBar,
              {
                transform: [
                  {
                    scaleY: amplitude, // Scale the height based on amplitude
                  },
                ],
              },
            ]}
          />
        </View>
      )}

      <ScrollView>{getRecordingLines()}</ScrollView>
      <View style={styles.recordButtonContainer} {...panResponder.panHandlers}>
        <View
          style={[
            styles.recordButton,
            recordingActive && styles.recordingActive,
          ]}
        >
          <Icon
            name={recordingActive ? "stop-circle" : "recording"}
            style={styles.recordIcon}
          />
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
    height: 200,
  },
  recordingText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#032757",
    marginTop: 50,
    marginLeft: 10,
  },
  progressContainer: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  amplitudeBar: {
    width: "100%",
    backgroundColor: "#2c709e",
    borderRadius: 5,
    height: 50,
  },
  recordButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2c709e",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  recordingActive: {
    backgroundColor: "#ff3b30",
  },
  recordButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  playButton: {
    fontSize: 30,
    textAlign: "center",
    borderRadius: 20,
    paddingTop: 5,
    marginLeft: 10,
  },
  clearButton: {
    fontSize: 25,
    textAlign: "center",
    borderRadius: 20,
    paddingTop: 5,
    marginRight: 10,
  },
  backIcon: {
    color: "#032757",
    fontSize: 28,
    marginTop: 55,
    marginLeft: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 40,
    marginLeft: 20,
  },
  fill: {
    flex: 1,
    margin: 15,
  },
  recordButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  recordButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "#2c709e",
    alignItems: "center",
    justifyContent: "center",
  },
  recordingActive: {
    backgroundColor: "#c70000",
  },
  recordIcon: {
    color: "#ffffff",
    fontSize: 40,
  },
});

export default Recording;
