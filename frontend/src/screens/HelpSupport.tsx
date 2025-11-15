import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpSupportScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Help & Support</Text>
      <Text style={styles.subHeader}>Find answers and get assistance</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput placeholder="Search" style={{ flex: 1, marginLeft: 6 }} />
      </View>

      {/* Contact Options */}
      <View style={styles.contactRow}>
        <TouchableOpacity style={styles.contactCard}>
          <Ionicons name="call-outline" size={28} color="#111" />
          <Text>Call Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#111" />
          <Text>Live Chat{'\n'}Available 24/7</Text>
        </TouchableOpacity>
      </View>

      {/* FAQ */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions?</Text>
      {['What is AI distress detection?', 'How do I request a limit increase?', 'Why do I need video verification?', 'How secure is my personal information?'].map((q, i) => (
        <TouchableOpacity key={i} style={styles.faqItem}>
          <Text style={{ flex: 1 }}>{q}</Text>
          <Ionicons name="chevron-down" size={18} color="#111" />
        </TouchableOpacity>
      ))}

      {/* AI Info */}
      <View style={styles.aiCard}>
        <Text style={{ fontWeight: '700', marginBottom: 6 }}>AI-Enhanced Security</Text>
        <Text style={{ fontSize: 12, color: '#374151' }}>
          Our system helps protect you by analyzing patterns that might indicate fraud, coercion, or identity theft. 
          This technology works in the background to ensure your financial safety.
        </Text>
        <Text style={{ marginTop: 8, fontSize: 12, fontWeight: '600' }}>What we analyze:</Text>
        <Text style={styles.bullet}>• Voice patterns and stress indicators</Text>
        <Text style={styles.bullet}>• Typing behavior and timing</Text>
        <Text style={styles.bullet}>• Request patterns and amounts</Text>
        <Text style={styles.bullet}>• Historical account behavior</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 18, fontWeight: '700' },
  subHeader: { fontSize: 13, color: '#6B7280', marginBottom: 16 },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 10, borderRadius: 12, marginBottom: 20 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  contactCard: { flex: 1, backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 6 },

  sectionTitle: { fontWeight: '600', marginBottom: 10 },
  faqItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, marginBottom: 10 },

  aiCard: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginTop: 20 },
  bullet: { fontSize: 12, marginTop: 2 },
});
