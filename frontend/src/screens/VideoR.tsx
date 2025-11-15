import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function VideoR() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const cameraRef = useRef<CameraView | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxDuration = 30; // seconds
  const minDuration = 10; // seconds

  const { amount, reason, email, processing } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getPermissions = async () => {
      if (Platform.OS === "web") {
        console.warn("Camera not supported on web");
        return;
      }

      const cameraPerm = await Camera.requestCameraPermissionsAsync();
      const micPerm = await Camera.requestMicrophonePermissionsAsync();

      setHasPermission(
        cameraPerm.status === "granted" && micPerm.status === "granted"
      );
    };

    getPermissions();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setRecording(true);
      setTimeElapsed(0);

      const videoPromise = cameraRef.current.recordAsync({
        maxDuration, // auto stop after maxDuration
        quality: "720p",
      });

      intervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev + 1 >= maxDuration) stopRecording();
          return prev + 1;
        });
      }, 1000);

      const data = await videoPromise;
      if (data?.uri) {
        await saveVideo(data.uri);
        router.push({
          pathname: "videoS",
          params: { amount, reason, email, processing },
        });
      }
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert("Error", "Failed to record video.");
    }
  };

  const stopRecording = async () => {
    if (timeElapsed < minDuration) {
      Alert.alert("Minimum Time", `Please record for at least ${minDuration} seconds.`);
      return;
    }

    if (cameraRef.current && recording) {
      await cameraRef.current.stopRecording();
      setRecording(false);
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const saveVideo = async (uri: string) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Videos", asset, false);
      console.log("Video saved:", uri);
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>No camera or microphone permission granted.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Verification</Text>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        mode="video"
      >
        <View style={styles.overlay}>
          {recording && <Text style={styles.timer}>Recording: {timeElapsed}s</Text>}
          <Button
            title={recording ? "Stop Recording" : "Start Recording"}
            onPress={recording ? stopRecording : startRecording}
            color={recording ? "red" : "#1E90FF"}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, textAlign: "center", marginVertical: 10 },
  camera: { flex: 1, justifyContent: "flex-end" },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    alignItems: "center",
  },
  timer: { color: "white", marginBottom: 10, fontSize: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

