import React, { useState, useEffect } from "react";
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
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const Recording = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [amplitude, setAmplitude] = useState(new Animated.Value(1));
  const [isRecordingActive, setIsRecordingActive] = useState(false);

  // Monitor amplitude while recording
  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(async () => {
        try {
          const status = await recording.getStatusAsync();
          if (status.isRecording) {
            const newAmplitude = Math.random(); // Simulated amplitude
            setAmplitude(newAmplitude);
          }
        } catch (error) {
          console.error("Error updating amplitude:", error);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [recording]);

  // Cleanup recording instance on unmount
  useEffect(() => {
    return () => {
      if (recording) {
        recording
          .stopAndUnloadAsync()
          .catch((error) => console.warn("Error during cleanup:", error));
      }
    };
  }, [recording]);

  // Start recording
  const startRecording = async () => {
    if (isRecordingActive) return;

    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission Denied", "You need to allow audio recording.");
        return;
      }

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

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      setIsRecordingActive(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!isRecordingActive || !recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const { sound, status } = await recording.createNewLoadedSoundAsync();

      setRecordings((prev) => [
        ...prev,
        {
          sound,
          duration: formatDuration(status.durationMillis),
          file: uri,
        },
      ]);

      setRecording(null);
      setIsRecordingActive(false);
      setAmplitude(new Animated.Value(1));
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Error", "Failed to stop recording.");
    }
  };

  // Format duration
  const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  // Delete recording
  const deleteRecording = (index) => {
    setRecordings((prev) => prev.filter((_, i) => i !== index));
  };

  // Confirm deletion
  const confirmDeleteRecording = (index) => {
    Alert.alert(
      "Delete Recording",
      "Are you sure you want to delete this recording?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteRecording(index) },
      ]
    );
  };

  // Render recording list
  const renderRecordings = () =>
    recordings.map((recording, index) => (
      <View key={index} style={styles.row}>
        <TouchableOpacity onPress={() => confirmDeleteRecording(index)}>
          <Icon name="trash-sharp" style={styles.clearButton} />
        </TouchableOpacity>
        <Text style={styles.fill}>
          Recording #{index + 1} | {recording.duration}
        </Text>
        <TouchableOpacity onPress={() => recording.sound.replayAsync()}>
          <Icon name="play-circle-outline" style={styles.playButton} />
        </TouchableOpacity>
      </View>
    ));

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

      {isRecordingActive && (
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.amplitudeBar,
              { transform: [{ scaleY: amplitude }] },
            ]}
          />
        </View>
      )}

      <ScrollView>{renderRecordings()}</ScrollView>
      <View style={styles.recordButtonContainer} {...panResponder.panHandlers}>
        <View
          style={[
            styles.recordButton,
            isRecordingActive && styles.recordingActive,
          ]}
        >
          <Icon
            name={isRecordingActive ? "stop-circle" : "mic-circle"}
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
  recordIcon: {
    color: "#ffffff",
    fontSize: 40,
  },
});

export default Recording;
