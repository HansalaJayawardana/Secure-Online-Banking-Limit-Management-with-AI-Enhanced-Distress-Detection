import React, { useState, useEffect } from "react";
import { Alert, View, Text, Button, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function VideoS() {
  const router = useRouter();
  const { amount, reason, email, processing } = useLocalSearchParams();

  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // -----------------------------
  // Fake video preview for Expo Go
  // -----------------------------
  useEffect(() => {
    console.log("Simulating video load...");
    // You can replace this with any small sample video URL for testing
    setVideoURL("https://www.w3schools.com/html/mov_bbb.mp4"); 
  }, []);

  // -----------------------------
  // Skip stopping camera tracks
  // -----------------------------
  /*
  useEffect(() => {
    return () => {
      const videoElement = document.querySelector("video");
      const tracks = videoElement?.srcObject?.getTracks?.();
      if (tracks) {
        tracks.forEach((track) => track.stop());
        console.log("Camera tracks stopped.");
      }
    };
  }, []);
  */

  const handleSubmit = async () => {
    setSaving(true);

    // -----------------------------
    // Skip extracting frame and analyzing video
    // -----------------------------
    /*
    if (!videoURL) return alert("No video found!");

    try {
      const frameBase64 = await extractFrame(videoURL, 1); 
      const result = await analyzeEmotion(frameBase64);
      console.log("Emotion analysis:", result);
    } catch (err) {
      console.error(err);
      alert("Error analyzing video");
    }
    */

    // -----------------------------
    // Fake submission success
    // -----------------------------
    Alert.alert("Success", "Video was analyzed successfully!");
    handleNext();
    setSaving(false);
  };

  const handleNext = () => {
    router.push({
      pathname: "aiAnalyze",
      params: { amount, reason, email, processing },
    });
  };

  const handleRetake = () => {
    // -----------------------------
    // Skip removing video from localStorage
    // -----------------------------
    // localStorage.removeItem("videoBase64");
    router.push("/videoR");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview Your Video</Text>

      {videoURL ? (
        // In Expo Go we use the URL just for demonstration
        <Text style={styles.videoPlaceholder}>
          Video preview.
        </Text>
      ) : (
        <Text>No video available</Text>
      )}

      <Button
        title={saving ? "Analyzing..." : "Submit"}
        onPress={handleSubmit}
        disabled={saving}
        color="#10B981"
      />

      <View style={{ marginTop: 10 }}>
        <Button title="Retake Video" onPress={handleRetake} color="#EF4444" />
      </View>
    </View>
  );
}

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  videoPlaceholder: {
    width: 300,
    height: 200,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 200,
    marginBottom: 20,
    backgroundColor: "#eee",
  },
});
