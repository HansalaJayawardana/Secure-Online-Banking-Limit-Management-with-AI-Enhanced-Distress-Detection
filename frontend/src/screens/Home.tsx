import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, BackHandler, Alert  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen() {
  const router = useRouter();
  const [userID, setUserID] = useState("Loading...");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserID(data.userID || "Unknown");
        } else {
          setUserID("Unknown");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserID("Unknown");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      // If on HomeScreen, show the confirmation dialog
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel", 
            onPress: () => null, 
            style: "cancel"
          },
          {
            text: "Logout", 
            onPress: () => {
              // Handle logout logic
              auth.signOut()
                .then(() => {
                  // Redirect user to the login screen after logging out
                  router.push("/login");
                })
                .catch((err) => console.log("Error during logout: ", err));
            },
          },
        ],
        { cancelable: false }
      );
      return true; // Prevent the default back action
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => backHandler.remove(); // Clean up the event listener
  }, [router]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        <TouchableOpacity onPress={() => router.push("profile")}>
          <Image
            source={require("../../assets/images/Avatar.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.hello}>Hello,</Text>
          <Text style={styles.username}>{userID}</Text>
        </View>

        {/* Notifications */}
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#111"
          style={styles.notifIcon}
          onPress={() => router.push("notifications")}
        />
      </View>

      {/* Account Card */}
      <View style={styles.card}>
        <Text style={styles.accountType}>Saving Account</Text>
        <Text style={styles.balance}>10,000,035.59 LKR</Text>
        <Text style={styles.growth}>📈 +2.4% from last month</Text>
        <View style={styles.limitRow}>
          <Text style={styles.limitText}>
            Daily Limit{'\n'}5,000,000 LKR
          </Text>
          <Text style={styles.limitText}>
            Available{'\n'}2,000,000 LKR
          </Text>
        </View>
      </View>

      {/* Request Limit Card */}
      <View style={styles.card}>
        <View style={styles.requestHeader}>
          <Ionicons name="cash-outline" size={22} color="#0A9396" />
          <Text style={styles.requestTitle}>  Request Limit Increase</Text>
          <TouchableOpacity style={{ marginLeft: "auto" }} onPress={() => router.push("request")}>
            <Ionicons name="add-circle" size={28} color="#0A9396" />
          </TouchableOpacity>
        </View>

        {/* Request History (static for now) */}
        <View style={styles.historyRow}>
          <Text>7,500,000 LKR</Text>
          <Text style={styles.rejected}>Rejected</Text>
        </View>
        <View style={styles.historyRow}>
          <Text>6,500,000 LKR</Text>
          <Text style={styles.accepted}>Approved</Text>
        </View>
        <View style={styles.historyRow}>
          <Text>5,500,000 LKR</Text>
          <Text style={styles.accepted}>Approved</Text>
        </View>
      </View>

      {/* Help */}
      <TouchableOpacity style={styles.helpBtn} onPress={() => router.push("helpSupport")}>
        <Text style={{ color: "#111" }}>Help & FAQ</Text>
        <Ionicons name="chevron-forward" size={18} color="#111" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  hello: { fontSize: 14, color: "#6B7280" },
  username: { fontSize: 16, fontWeight: "600", color: "#111827" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  accountType: { fontSize: 14, color: "#6B7280" },
  balance: { fontSize: 20, fontWeight: "700", marginVertical: 4, color: "#111827" },
  growth: { fontSize: 12, color: "#10B981", marginBottom: 10 },
  limitRow: { flexDirection: "row", justifyContent: "space-between" },
  limitText: { fontSize: 13, color: "#374151", textAlign: "center" },

  requestHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  requestTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },

  historyRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  rejected: { color: "#EF4444", fontWeight: "600" },
  accepted: { color: "#10B981", fontWeight: "600" },

  helpBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  notifIcon: { marginLeft: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#e5e7eb",
  },
  greeting: { flex: 1 },
});
