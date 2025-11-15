import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchRequests(user.uid, selectedFilter);  // Fetch requests based on filter
        console.log("User ID:", user.uid);
      } else {
        console.log("No user signed in");
        setRequests([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [selectedFilter]);  // Re-run the effect when filter changes

 const fetchRequests = async (uid, filter) => {
  setLoading(true);
  try {
    let q;

    // If user selected "All" → fetch all user requests
    if (filter === 'All') {
      q = query(
        collection(db, "limitRequests"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
    } 
    // Otherwise filter by status
    else {
      q = query(
        collection(db, "limitRequests"),
        where("userId", "==", uid),
        where("status", "==", filter),
        orderBy("createdAt", "desc")
      );
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRequests(data);
  } catch (err) {
    console.error("Error fetching requests:", err);
  } finally {
    setLoading(false);
  }
};



  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);  // Change selected filter
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#10B981";
      case "Rejected":
        return "#EF4444";
      default:
        return "#F59E0B"; // Pending
    }
  };

  const getUrgencyStyle = (processing) => {
    switch (processing) {
      case "emergency":
        return styles.badgeHigh;
      case "urgent":
        return styles.badgeMedium;
      case "standard":
      default:
        return styles.badgeLow;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('home')} style={styles.homeButton}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.homeButtonText}>Return to Home</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Request Status</Text>
      <Text style={styles.subHeader}>Track your limit increase requests</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput placeholder="Search" style={{ flex: 1, marginLeft: 6 }} />
        <Ionicons name="mic-outline" size={20} color="#9CA3AF" />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, selectedFilter === f && styles.selectedFilter]}
            onPress={() => handleFilterChange(f)}  // Set the selected filter
          >
            <Text style={{ color: selectedFilter === f ? '#fff' : '#111' }}>{f}</Text>

          </TouchableOpacity>
        ))}
      </View>

      {/* Requests */}
      {loading ? (
        <Text>Loading requests...</Text>
      ) : requests.length === 0 ? (
        <Text>No requests found.</Text>
      ) : (
        requests.map((req) => (
          <View key={req.id} style={[styles.card, { borderLeftColor: getStatusColor(req.status) }]}>
            <View style={styles.row}>
              <Text style={{ color: getStatusColor(req.status), fontWeight: '700', marginRight: 8 }}>
                {req.status}
              </Text>
              <Text style={getUrgencyStyle(req.processing)}>{req.processing}</Text>
            </View>
            <Text style={styles.amount}>LKR {parseFloat(req.amount).toLocaleString()}</Text>
            <Text style={styles.desc}>Reason: {req.reason}</Text>
            <Text style={styles.desc}>
              Submitted: {req.createdAt && req.createdAt.toDate
                ? new Date(req.createdAt.toDate()).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 18, fontWeight: '700' },
  subHeader: { fontSize: 13, color: '#6B7280', marginBottom: 16 },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 10, borderRadius: 12, marginBottom: 16 },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterBtn: { backgroundColor: '#F3F4F6', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 10 },
  selectedFilter: { backgroundColor: '#3B82F6', color: '#fff' },  // Style for selected filter

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statusAccepted: { color: '#10B981', fontWeight: '700', marginRight: 8 },
  statusPending: { color: '#F59E0B', fontWeight: '700', marginRight: 8 },
  statusRejected: { color: '#EF4444', fontWeight: '700', marginRight: 8 },
  reqId: { marginLeft: 'auto', fontSize: 12, color: '#6B7280' },
  badgeMedium: { backgroundColor: '#FDE68A', color: '#92400E', paddingHorizontal: 8, borderRadius: 6, fontSize: 12 },
  badgeHigh: { backgroundColor: '#FECACA', color: '#991B1B', paddingHorizontal: 8, borderRadius: 6, fontSize: 12 },
  badgeLow: { backgroundColor: '#D1FAE5', color: '#065F46', paddingHorizontal: 8, borderRadius: 6, fontSize: 12 },
  amount: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 13, color: '#374151' },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6', // Blue
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});