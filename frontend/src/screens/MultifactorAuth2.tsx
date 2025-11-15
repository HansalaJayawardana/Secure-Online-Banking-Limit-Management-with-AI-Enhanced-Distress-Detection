import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";

export default function MultiFactorAuth2() {
  const router = useRouter();
  const { amount, reason, email, processing } = useLocalSearchParams();

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert("Biometric not available", "Biometric authentication is not set up on this device.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to proceed",
        fallbackLabel: "Use Passcode",
      });
if (result.success) {
  if (processing === "high" || processing === "emergency") {
    router.push({
      pathname: "multiAuth3",
      params: { amount, reason, email, processing },
    });
  } else {
    // Navigate to next step
    router.push({
      pathname: "submit",
      params: { amount, reason, email, processing },
    });
  }
}
else {
  Alert.alert("Authentication Failed", "Biometric authentication was not successful.");
}

    } catch (err) {
      Alert.alert("Error", "An error occurred while authenticating.");
      console.error("Biometric error:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <View>
          <Text style={styles.header}>Multi-Factor Authentication</Text>
          <Text style={styles.step}>Step 2 of 3</Text>
        </View>
      </View>

      {/* Top icons */}
      <View style={styles.iconRow}>
        <Ionicons name="finger-print-outline" size={40} color="#111" />
        <MaterialCommunityIcons name="face-recognition" size={40} color="#111" style={{ marginLeft: 16 }} />
      </View>

      {/* Description */}
      <Text style={styles.subHeader}>Biometric Authentication</Text>
      <Text style={styles.helper}>Use your fingerprint or face to verify your identity</Text>

      {/* Face ID + Fingerprint options */}
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.optionCard} activeOpacity={0.8} onPress={handleBiometricAuth}>
          <MaterialCommunityIcons name="face-recognition" size={50} color="#6B7280" />
          <Text style={styles.optionText}>Face ID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} activeOpacity={0.8} onPress={handleBiometricAuth}>
          <Ionicons name="finger-print-outline" size={50} color="#6B7280" />
          <Text style={styles.optionText}>Fingerprint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, alignItems: "center" },
  headerRow: { flexDirection: "row", alignSelf: "flex-start", alignItems: "center", marginBottom: 30 },
  header: { fontSize: 18, fontWeight: "700", marginLeft: 10 },
  step: { fontSize: 12, color: "#6B7280", marginLeft: 10 },
  iconRow: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  subHeader: { fontSize: 16, fontWeight: "600" },
  helper: { fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 30 },
  optionRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingHorizontal: 10 },
  optionCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: { marginTop: 8, fontSize: 15, fontWeight: "500", color: "#374151" },
});
