import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("Error", "No user is currently logged in.");
        return;
      }

      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        Alert.alert("Error", "User data not found in Firestore.");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
      Alert.alert("Error", "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push("login");
  } catch (error) {
    Alert.alert("Logout Failed", error.message);
  }
};

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#EF4444" />
        <Text style={{ marginTop: 12 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>User data not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/images/Avatar.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraBtn}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info fields */}
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputRow}>
          <TextInput value={userData.fullName} editable={false} style={styles.input} />
          <Ionicons name="create-outline" size={20} color="#374151" />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Login Name</Text>
        <View style={styles.inputRow}>
          <TextInput value={userData.userID} editable={false} style={styles.input} />
          <Ionicons name="create-outline" size={20} color="#374151" />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.inputRow}>
          <TextInput value={userData.phone} editable={false} style={styles.input} />
          <Ionicons name="create-outline" size={20} color="#374151" />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <TextInput value={userData.email} editable={false} style={styles.input} />
          <Ionicons name="create-outline" size={20} color="#374151" />
        </View>
      </View>

      {/* Note */}
      <Text style={styles.note}>
        Note: All communication, including OTPs, will be sent to your email detail mentioned here.
      </Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
  <Text style={styles.logoutText}>Log Out</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E5E7EB' },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    backgroundColor: '#0A9396',
    padding: 6,
    borderRadius: 20,
  },

  field: { marginBottom: 16 },
  label: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  input: { flex: 1, fontSize: 14, color: '#111827' },

  note: { fontSize: 12, color: '#6B7280', marginTop: 20 },
  logoutBtn: {
  marginTop: 30,
  backgroundColor: '#EF4444',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},
logoutText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '500',
},

});
