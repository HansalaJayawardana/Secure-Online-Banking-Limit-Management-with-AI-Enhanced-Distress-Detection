import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';  // <-- import useRouter

const StartingPage = () => {
  const router = useRouter();  // <-- get router instance

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('login');  // <-- use router.replace instead of navigation.replace
    }, 1500);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoCard}>
        <Image
          source={require('../../assets/images/SafeBankLogo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>SAFEBANK+</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  logoCard: {
    backgroundColor: '#061A34',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  logo: { width: 120, height: 120, resizeMode: 'contain' },
  appName: { marginTop: 8, color: '#36D399', fontWeight: '700', fontSize: 18, letterSpacing: 1 },
});

export default StartingPage;
