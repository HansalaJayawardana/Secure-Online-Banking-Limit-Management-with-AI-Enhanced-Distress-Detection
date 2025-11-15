import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "../../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function SubmitRequest() {
  const router = useRouter();
  const { amount, reason, email, processing, resultStatus } = useLocalSearchParams();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      // ✅ Determine status logic based on AI result & processing
      let status = "Pending";

      if (processing === "emergency" || processing === "high") {
        if (resultStatus?.toLowerCase() === "pass") {
          status = "Approved";
        } else if (resultStatus?.toLowerCase() === "fail") {
          status = "Rejected";
        } else {
          status = "Pending";
        }
      }

      await addDoc(collection(db, "limitRequests"), {
        email,
        amount: parseFloat(amount),
        reason,
        processing,
        userId: user.uid,
        status,
        createdAt: Timestamp.now(),
      });

 Alert.alert(
  "Success",
  `Your request has been submitted! Status: ${status}`
);


      // ✅ Navigate appropriately
      router.replace("/home");

    } catch (err) {
      Alert.alert("Error", "Failed to submit request.");
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Request</Text>
      <Text style={styles.label}>Amount: LKR {amount}</Text>
      <Text style={styles.label}>Reason: {reason}</Text>
      <Text style={styles.label}>Email: {email}</Text>
      <Text style={styles.label}>Processing: {processing}</Text>

      {(processing === "high" || processing === "emergency") && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            AI Verification Result:{" "}
            <Text style={{ color: resultStatus === "pass" ? "green" : "red" }}>
              {resultStatus ? resultStatus.toUpperCase() : "N/A"}
            </Text>
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Final Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginVertical: 6 },
  submitBtn: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  resultBox: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});