import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingBiometric, setLoadingBiometric] = useState(false);

  //  Email + Password Login (now supports admin)
 const handleLogin = async () => {
  if (!email || !password) {
    Toast.show({
      type: 'error',
      text1: 'Missing Fields',
      text2: 'Please enter both email and password.',
    });
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.email === "admin@safebank.com") {
      Toast.show({
        type: 'success',
        text1: 'Welcome Admin!',
        text2: 'Redirecting to admin dashboard...',
      });
      router.push("/adminDashboard");
    } else {
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
      router.push("/home");
    }

  } catch (err) {
    console.log("Login error:", err);
    Toast.show({
      type: 'error',
      text1: 'Invalid Credentials',
      text2: 'Please check your email or password.',
    });
  }
};

  // Biometric Login (Face ID / Fingerprint)
  const handleBiometricLogin = async () => {
    setLoadingBiometric(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert("Error", "Biometric hardware not available");
        setLoadingBiometric(false);
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert("Error", "No biometrics enrolled");
        setLoadingBiometric(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with Face ID / Fingerprint",
        fallbackLabel: "Enter Password",
        cancelLabel: "Cancel",
      });

      if (result.success) {
        Alert.alert("Success", "Logged in with Biometrics!");
        router.push("/home"); // biometric goes to user home
      } else {
        Alert.alert("Error", "Biometric authentication failed");
      }
    } catch (error) {
      console.log("Biometric login error:", error);
      Alert.alert("Error", "An error occurred during biometric login");
    }

    setLoadingBiometric(false);
  };

  return (
    <View style={styles.container}>
      {/* Logo + subtitle */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/SafeBankLogo.png")}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>AI-Enhanced Security</Text>
      </View>

      {/* Email */}
      <View style={styles.inputRow}>
        <Ionicons name="mail-outline" size={22} color="#7A7A7A" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9E9E9E"
          style={styles.textInput}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loadingBiometric}
        />
      </View>

      {/* Password */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={22} color="#7A7A7A" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9E9E9E"
          style={styles.textInput}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loadingBiometric}
        />
      </View>

      {/* Forgot password */}
      <Text style={styles.forgot}>Forgot Password?</Text>

      {/* Auth options + Sign In */}
      <View style={styles.actionsRow}>
        <View style={styles.iconPair}>
          <TouchableOpacity
            onPress={handleBiometricLogin}
            disabled={loadingBiometric}
            style={styles.biometricBtn}
          >
            <Ionicons name="finger-print-outline" size={38} color="#333" />
            <Text style={styles.biometricText}>Fingerprint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBiometricLogin}
            disabled={loadingBiometric}
            style={styles.biometricBtn}
          >
            <MaterialCommunityIcons name="face-recognition" size={38} color="#333" />
            <Text style={styles.biometricText}>Face ID</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signInBtn}
          activeOpacity={0.85}
          onPress={handleLogin}
          disabled={loadingBiometric}
        >
          <Text style={styles.signInText}>Sign in</Text>
          <Ionicons name="log-in-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("register")}>
          <Text style={[styles.registerText, styles.registerLink]}>Register</Text>
        </TouchableOpacity>
      </View>

<Toast />

      <Text style={styles.footerNote}>
        🔒 Your data is protected with bank-level encryption
      </Text>
    </View>
  );
}

//  Same styles as before
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 24, paddingTop: 40 },
  header: { alignItems: "center", marginBottom: 28 },
  logo: { width: 100, height: 100, resizeMode: "contain" },
  subtitle: { marginTop: 8, color: "#6B7280" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#D1D5DB",
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingBottom: 8,
  },
  icon: { marginRight: 8 },
  textInput: { flex: 1, fontSize: 16, color: "#111827", paddingVertical: 4 },
  forgot: { alignSelf: "flex-end", color: "#6B7280", fontSize: 12, marginBottom: 24 },
  actionsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconPair: { flexDirection: "row", gap: 18, alignItems: "center" },
  biometricBtn: { alignItems: "center", marginHorizontal: 10 },
  biometricText: { marginTop: 6, fontSize: 14, color: "#374151", fontWeight: "600" },
  signInBtn: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 3,
  },
  signInText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  registerContainer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  registerText: { fontSize: 14, color: "#6B7280" },
  registerLink: { color: "#EF4444", fontWeight: "700" },
  footerNote: { textAlign: "center", color: "#9CA3AF", fontSize: 12, marginTop: 28 },
});

