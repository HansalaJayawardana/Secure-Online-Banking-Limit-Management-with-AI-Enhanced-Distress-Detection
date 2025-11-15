import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'expo-router';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [userID, setUserId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const db = getFirestore();

  const handleRegister = async () => {
  if (!fullName || !email || !phone || !userID || !password || !confirmPassword) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Please fill all the fields.',
    });
    return;
  }

  if (!isValidEmail(email)) {
    Toast.show({
      type: 'error',
      text1: 'Invalid Email',
      text2: 'Please enter a valid email address.',
    });
    return;
  }

  if (password.length < 6) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Password must be at least 6 characters.',
    });
    return;
  }

  if (password !== confirmPassword) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Passwords do not match!',
    });
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      phone,
      userID,
      createdAt: new Date().toISOString()
    });

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Account created!',
    });

    router.push("/login");

  } catch (err) {
    console.log("Register error:", err);
    Alert.alert("Error", err.message);
  }
};

  const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Logo + subtitle */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/SafeBankLogo.png')}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>Create Your SafeBank+ Account</Text>
      </View>

      {/* Full Name */}
      <View style={styles.inputRow}>
        <Ionicons name="person-outline" size={20} color="#7A7A7A" style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          style={styles.textInput}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email */}
      <View style={styles.inputRow}>
        <Ionicons name="mail-outline" size={20} color="#7A7A7A" style={styles.icon} />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputRow}>
        <Ionicons name="call-outline" size={20} color="#7A7A7A" style={styles.icon} />
        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          style={styles.textInput}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* User ID */}
      <View style={styles.inputRow}>
        <Ionicons name="id-card-outline" size={20} color="#7A7A7A" style={styles.icon} />
        <TextInput
          placeholder="User ID"
          autoCapitalize="none"
          style={styles.textInput}
          value={userID}
          onChangeText={setUserId}
        />
      </View>

      {/* Password */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#7A7A7A" style={styles.icon} />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Password */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#7A7A7A" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.textInput}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity
        style={styles.registerBtn}
        activeOpacity={0.85}
        onPress={handleRegister}  // this works now
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      {/* Already have an account */}
      <Text style={styles.loginLink}>
        Already have an account?{' '}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('login')}
        >
          Sign In
        </Text>
      </Text>
      <Toast />

      {/* Footer */}
      <Text style={styles.footerNote}>
        🔒 Your data is protected with bank-level encryption
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 100, height: 100, resizeMode: 'contain' },
  subtitle: { marginTop: 8, color: '#6B7280', fontSize: 14 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#D1D5DB',
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingBottom: 8,
  },
  icon: { marginRight: 8 },
  textInput: { flex: 1, fontSize: 16, color: '#111827', paddingVertical: 4 },

  registerBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  registerText: { color: '#fff', fontWeight: '700', fontSize: 18 },

  loginLink: { textAlign: 'center', color: '#6B7280', fontSize: 14, marginTop: 20 },
  linkText: { color: '#EF4444', fontWeight: '600' },

  footerNote: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 28 },
});
