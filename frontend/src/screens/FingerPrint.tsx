import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FaceIdScreen() {
  const handleFaceId = () => {
    // Here you would later integrate expo-local-authentication for real Face ID
    alert('Face ID authentication triggered!');
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
      <TouchableOpacity style={styles.faceIdCard} activeOpacity={0.85} onPress={handleFaceId}>
        <Ionicons name="finger-print-outline" size={48} color="#374151" />
        <Text style={styles.faceIdText}>Fingerprint</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6B7280', alignItems: 'center', justifyContent: 'center' }, // gray background like mock
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
