import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { auth,db } from "../../config/firebase";
import Toast from "react-native-toast-message";
import { signOut } from 'firebase/auth';
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Fetch only pending requests
  const fetchRequests = async () => {
  try {
    // ✅ Query Firestore ordered by createdAt (descending = newest first)
    const q = query(collection(db, "limitRequests"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((req) => req.status === "Pending"); // ✅ show only pending

    setRequests(data);
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Failed to load requests.");
  } finally {
    setLoading(false);
  }
};


  const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push("login");
  } catch (error) {
    Alert.alert("Logout Failed", error.message);
  }
};

  // 🔹 Handle Approve/Reject
  const handleAction = async (id, status) => {
    try {
      const ref = doc(db, "limitRequests", id);
      await updateDoc(ref, { status });

      // ✅ Instantly remove it from state (no need to re-fetch)
      setRequests((prev) => prev.filter((req) => req.id !== id));

      // ✅ Show toast notification
      Toast.show({
        type: status === "Approved" ? "success" : "error",
        text1: `Request ${status}`,
        visibilityTime: 1500,
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update request.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.email}>{item.email}</Text>
      <Text>Amount: LKR {item.amount}</Text>
      <Text>Reason: {item.reason}</Text>
      <Text>Processing: {item.processing}</Text>
      <Text>Status: {item.status}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#10B981" }]}
          onPress={() => handleAction(item.id, "Approved")}
        >
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#EF4444" }]}
          onPress={() => handleAction(item.id, "Rejected")}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading pending requests...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutSmallBtn}>
          <Text style={styles.logoutSmallText}>Logout</Text>
        </TouchableOpacity>
      {requests.length === 0 ? (
        <Text style={styles.emptyText}>No pending requests 🎉</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* Toast UI */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  email: { fontWeight: "600", fontSize: 15, color: "#111827", marginBottom: 5 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#6B7280" },
  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 40, fontSize: 16 },
logoutSmallBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutSmallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

});
