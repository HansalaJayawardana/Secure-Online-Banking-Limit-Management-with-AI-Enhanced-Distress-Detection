// OTP
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from "react-native-toast-message";

export default function MultiFactorAuthScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const router = useRouter();
  const { amount, reason, email, processing } = useLocalSearchParams();

  const handleChange = (text, index) => {
    const newCode = [...code];

    if (/^\d$/.test(text)) {
      newCode[index] = text;
      setCode(newCode);

      // Move to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (text === '') {
      // Allow clearing input
      newCode[index] = '';
      setCode(newCode);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    try {
      const entered = code.join('');
      const res = await fetch("http://192.168.1.4:5000/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: entered }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Invalid code");

      Alert.alert("Verified", "OTP verified successfully");
      Toast.show({
            type: 'success',
            text1: 'Verified',
            text2: 'OTP verified successfully',
          });
      handleNext();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };


  const handleNext = () => {
      router.push({
        pathname: "multiAuth2",
        params: { amount, reason, email, processing },
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Multi-Factor Authentication</Text>
      <Text style={styles.step}>Step 1 of 3</Text>

      <View style={styles.illustration}>
        <Ionicons name="keypad-outline" size={60} color="#111" />
      </View>

      <Text style={styles.subHeader}>Enter Verification Code</Text>
      <Text style={styles.helper}>We’ve sent a 6-digit code to {email}</Text>

      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputRefs.current[i] = ref)}
            style={styles.codeBox}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleChange(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify Code</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
  },
  step: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
  },
  illustration: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
  },
  helper: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  codeBox: {
    borderBottomWidth: 2,
    borderColor: '#D1D5DB',
    width: 40,
    height: 50,
    marginHorizontal: 6,
    fontSize: 20,
    textAlign: 'center',
  },
  verifyBtn: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  verifyText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
