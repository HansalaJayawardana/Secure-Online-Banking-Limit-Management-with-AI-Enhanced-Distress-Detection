import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';

export default function FaceIdScreen() {
  const router = useRouter();

  const handleFaceId = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      return Alert.alert('Error', 'Biometric authentication is not available.');
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Face ID',
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) {
      Alert.alert('Success', 'Authenticated with Face ID!');
      router.replace('/home'); // Navigate to home screen
    } else {
      Alert.alert('Failed', 'Authentication failed.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/SafeBankLogo.png')}
          style={styles.logo}
        />
      </View>

      {/* Face ID Card */}
      <TouchableOpacity
        style={styles.faceIdCard}
        activeOpacity={0.85}
        onPress={handleFaceId}
      >
        <MaterialCommunityIcons name="face-recognition" size={48} color="#374151" />
        <Text style={styles.faceIdText}>Face ID</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6B7280', alignItems: 'center', justifyContent: 'center' },
  logoContainer: { position: 'absolute', top: 80, alignItems: 'center' },
  logo: { width: 100, height: 100, resizeMode: 'contain' },
  faceIdCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 60,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  faceIdText: { marginTop: 10, fontSize: 18, color: '#374151', fontWeight: '600' },
});
