// Video
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";

export default function MultiFactorAuthStep2() {
    const router = useRouter();
    const { amount, reason, email, processing } = useLocalSearchParams();

  const handleStartRecording = () => {
    // Here you would integrate expo-camera or expo-av for real video capture
    router.push({
    pathname: "videoR",
    params: { amount, reason, email, processing },
  });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Ionicons name="chevron-back" size={24} color="#111" />
        <Text style={styles.header}>Video Verification</Text>
      </View>
      <Text style={styles.subHeader}>Prepare for recording</Text>

      {/* Camera placeholder */}
      <View style={styles.cameraBox}>
        <Ionicons name="videocam-outline" size={40} color="#6B7280" />
      </View>
      <Text style={styles.helper}>Position Your Face in the Frame{'\n'}Ensure Good Lighting and Clear Visibility</Text>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionHeader}>Recording Instructions:</Text>
        <Text style={styles.bullet}>1. State your full name clearly</Text>
        <Text style={styles.bullet}>2. Say: "I am requesting a limit increase"</Text>
        <Text style={styles.bullet}>3. Explain your reason briefly</Text>
        <Text style={styles.bullet}>4. Recording will automatically stop after 1 minute</Text>
      </View>

      {/* Start Recording */}
      <TouchableOpacity style={styles.recordBtn} onPress={handleStartRecording}>
        <Ionicons name="videocam" size={20} color="#fff" />
        <Text style={styles.recordText}> Start Video Recording</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  header: { fontSize: 18, fontWeight: '700', marginLeft: 8 },
  subHeader: { fontSize: 13, color: '#6B7280', marginBottom: 20, marginLeft: 32 },

  cameraBox: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  helper: { textAlign: 'center', fontSize: 12, color: '#6B7280', marginBottom: 20 },

  instructions: { borderColor: '#EF4444', borderWidth: 1, borderRadius: 12, padding: 12, backgroundColor: '#FEF2F2', marginBottom: 24 },
  instructionHeader: { fontWeight: '600', marginBottom: 6 },
  bullet: { fontSize: 13, color: '#374151', marginBottom: 4 },

  recordBtn: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
  },
  recordText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
