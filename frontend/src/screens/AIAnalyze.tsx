import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AIAnalysisScreen() {
  const router = useRouter();

  // State for random analysis results
  const [confidenceScore, setConfidenceScore] = useState('0%');
  const [riskLevel, setRiskLevel] = useState('Unknown');
  const [aiAssessment, setAiAssessment] = useState('');
  const [resultStatus, setResultStatus] = useState(''); // ✅ "pass" or "fail"

  const { amount, reason, email, processing } = useLocalSearchParams();

  // 🔹 Helper to generate random analysis
  const generateAnalysis = () => {
    const Confidence = Math.floor(Math.random() * 51) + 50; // 50% - 100%
    let risk = 'High';
    let assessment = '';
    let status = 'fail';

    if (Confidence >= 80) {
      risk = 'Low';
      assessment =
        'No distress indicators detected. Request appears legitimate and follows normal behavioral patterns. Approved for standard processing.';
      status = 'pass';
    } else if (Confidence >= 70) {
      risk = 'Medium';
      assessment =
        'Some minor inconsistencies detected. Request requires additional verification before approval.';
      status = 'pass';
    } else {
      risk = 'High';
      assessment =
        'Multiple distress indicators detected. Request flagged for manual review and possible rejection.';
      status = 'fail';
    }

    setConfidenceScore(`${Confidence}%`);
    setRiskLevel(risk);
    setAiAssessment(assessment);
    setResultStatus(status); // ✅ store pass/fail
  };

  useEffect(() => {
    generateAnalysis();
  }, []);

  // ✅ Navigate to Submit screen with all params
  const handleReturnToHome = () => {
    router.push({
      pathname: "submit",
      params: { amount, reason, email, processing, resultStatus },
    });
  };

  const handleViewRequestStatus = () => {
    router.push('notifications');
  };

  // 🔹 Risk color mapping
  const riskColor = {
    Low: '#4cd964',     // Green
    Medium: '#ff9f0a',  // Orange
    High: '#ff3b30',    // Red
  }[riskLevel] || '#999';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Analysis</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.analysisContainer}>
          <Image
            source={require('../../assets/images/aiBrain.png')}
            style={styles.aiIcon}
          />
          <Text style={styles.analysisTitle}>AI Security Analysis</Text>
          <Text style={styles.analysisSubtitle}>
            Analysis complete - your request has been submitted
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressPercentage}>100%</Text>
          </View>

          {/* Verification Steps */}
          <View style={styles.verificationList}>
            {[
              'Identity Verification',
              'Behavioral Analysis',
              'Risk Assessment',
              'Final Review',
            ].map((step) => (
              <View key={step} style={styles.verificationItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4cd964" />
                <View style={styles.verificationTextContainer}>
                  <Text style={styles.verificationTitle}>{step}</Text>
                  <Text style={styles.verificationSubtitle}>Complete</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Analysis Summary */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#4cd964" />
              <Text style={styles.summaryTitle}>Analysis Complete</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.confidenceScore}>{confidenceScore}</Text>
              <Text style={[styles.riskLevel, { color: riskColor }]}>{riskLevel}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Confidence Score</Text>
              <Text style={styles.riskLabel}>Risk Level</Text>
            </View>
            <Text style={styles.summaryText}>
              <Text style={{ fontWeight: 'bold' }}>AI Assessment:</Text> {aiAssessment}
            </Text>

            <View style={styles.statusBadges}>
              <View style={styles.statusBadgeGreen}>
                <Text style={styles.statusBadgeText}>Identity Verified</Text>
              </View>
              <View style={styles.statusBadgeGreen}>
                <Text style={styles.statusBadgeText}>
                  {resultStatus === 'pass' ? 'No Distress Detected' : 'Distress Detected'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.homeButton]}
          activeOpacity={0.85}
          onPress={handleReturnToHome}
        >
          <Text style={styles.actionButtonText}>Proceed to Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.statusButton]}
          activeOpacity={0.85}
          onPress={handleViewRequestStatus}
        >
          <Text style={styles.actionButtonText}>View Request Status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#333',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  analysisContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  aiIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  analysisSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressSection: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
    position: 'relative',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 5,
  },
  progressPercentage: {
    position: 'absolute',
    right: 15,
    bottom: 12,
    fontSize: 12,
    color: '#333',
  },
  verificationList: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  verificationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  verificationSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  verifiedBadge: {
    backgroundColor: '#4cd964',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4cd964',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  confidenceScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  riskLevel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  riskLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginTop: 10,
  },
  statusBadges: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  statusBadgeGreen: {
    backgroundColor: '#4cd964',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  homeButton: {
    backgroundColor: '#3b82f6',
  },
  statusButton: {
    backgroundColor: '#8b91a0',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
