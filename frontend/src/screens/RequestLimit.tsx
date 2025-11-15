import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth } from "../../config/firebase";
import { Picker } from "@react-native-picker/picker"; // Import Picker

export default function RequestLimitScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState(""); // Reason now a state for selected dropdown value
  const [email, setEmail] = useState(""); // will auto-fill from Firebase
  const [selectedProcessing, setSelectedProcessing] = useState(null);

  // 🔹 Get logged-in user's email
  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email) {
      setEmail(user.email);
    }
  }, []);

  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Notice", message);
    }
  };

  const handleProceed = async () => {
    const numericAmount = parseFloat(amount);

    if (!amount || !reason || !selectedProcessing) {
      return Alert.alert("Error", "Please fill all fields and select processing time");
    }

    if (isNaN(numericAmount) || numericAmount <= 5000000) {
      showToast("Enter a value more than 5,000,000");
      return;
    }

    try {
      const params = { amount, reason, email, processing: selectedProcessing };

          const res = await fetch("http://192.168.1.4:5000/api/otp/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to send OTP");

        router.push({ pathname: "multiAuth1", params });
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Request Limit Increase</Text>
      <Text style={styles.currentLimit}>Current limit: 5,000,000 LKR/day</Text>

      {/* Amount */}
      <Text style={styles.label}>Requested Amount (LKR)</Text>
      <View style={styles.inputBox}>
        <TextInput
          placeholder="LKR 0"
          keyboardType="numeric"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <Text style={styles.helper}>Maximum Increase: LKR 20,000,000/day</Text>

      {/* Reason - Dropdown */}
      <Text style={[styles.label, { marginTop: 16 }]}>Reason for Increase</Text>
      <View style={styles.inputBox}>
        <Picker
          selectedValue={reason}
          onValueChange={(itemValue) => setReason(itemValue)} // Handle change
        >
          <Picker.Item label="Select a reason" value="" />
          <Picker.Item label="Emergency Medical Payment" value="Emergency Medical Payment" />
          <Picker.Item label="Urgent Family or Personal Emergency" value="Urgent Family or Personal Emergency" />
          <Picker.Item label="Bill or Utility Payment Due Today" value="Bill or Utility Payment Due Today" />
          <Picker.Item label="Business Transaction or Supplier Payment" value="Business Transaction or Supplier Payment" />
          <Picker.Item label="Education Fee Payment" value="Education Fee Payment" />
          <Picker.Item label="Property or Loan Settlement" value="Property or Loan Settlement" />
          <Picker.Item label="High-Value Asset Purchase" value="High-Value Asset Purchase" />
          <Picker.Item label="Business Investment or Supplier Settlement" value="Business Investment or Supplier Settlement" />
          <Picker.Item label="Emergency Fund Transfer" value="Emergency Fund Transfer" />
        </Picker>
      </View>

      {/* Auto-filled Email Display */}
      <View style={styles.emailBox}>
        <Ionicons name="mail-outline" size={18} color="#3B82F6" />
        <Text style={styles.emailText}>{email || "Fetching your email..."}</Text>
      </View>

      {/* Processing Time */}
      <View style={styles.processingCard}>
        <View style={styles.rowHeader}>
          <Ionicons name="time-outline" size={20} color="#111" />
          <Text style={styles.processingTitle}>Processing Time</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.timeRow,
            selectedProcessing === "standard" && styles.selectedRow,
          ]}
          onPress={() => setSelectedProcessing("standard")}
        >
          <Text style={styles.timeText}>Standard (3–5 days)</Text>
          <Text
            style={[
              styles.status,
              { backgroundColor: "#D1FAE5", color: "#047857" },
            ]}
          >
            Low
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timeRow,
            selectedProcessing === "urgent" && styles.selectedRow,
          ]}
          onPress={() => setSelectedProcessing("urgent")}
        >
          <Text style={styles.timeText}>Urgent (1–2 days)</Text>
          <Text
            style={[
              styles.status,
              { backgroundColor: "#FEF3C7", color: "#92400E" },
            ]}
          >
            Medium
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timeRow,
            selectedProcessing === "emergency" && styles.selectedRow,
          ]}
          onPress={() => setSelectedProcessing("emergency")}
        >
          <Text style={styles.timeText}>
            Emergency (same day) — Requires video verification
          </Text>
          <Text
            style={[
              styles.status,
              { backgroundColor: "#FEE2E2", color: "#B91C1C" },
            ]}
          >
            High
          </Text>
        </TouchableOpacity>
      </View>

      {/* Security Notice */}
      <View style={styles.notice}>
        <Ionicons name="shield-checkmark-outline" size={18} color="#F59E0B" />
        <Text style={styles.noticeText}>
          Your request will be analyzed using AI-enhanced distress detection
          for additional security.
        </Text>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleProceed}>
        <Text style={styles.submitText}>Proceed to Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 6 },
  currentLimit: { fontSize: 13, color: "#6B7280", marginBottom: 12 },
  label: { fontSize: 13, color: "#6B7280" },

  inputBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  input: { fontSize: 16, color: "#111" },
  helper: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },

  emailBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    backgroundColor: "#E0F2FE",
    padding: 10,
    borderRadius: 10,
  },
  emailText: { marginLeft: 8, color: "#1E3A8A", fontWeight: "600" },

  processingCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rowHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  processingTitle: { marginLeft: 8, fontWeight: "600", color: "#111" },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  selectedRow: {
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  timeText: { color: "#111827", fontSize: 13, flex: 1, paddingRight: 6 },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: "600",
    fontSize: 12,
  },

  notice: {
    flexDirection: "row",
    borderColor: "#F59E0B",
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: "#FFFBEB",
  },
  noticeText: { fontSize: 12, color: "#92400E", marginLeft: 8, flex: 1 },

  submitBtn: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
