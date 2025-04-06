import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

export default function PrivacyScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Privacy & Data' }} />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Privacy & Data Policy</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data Storage</Text>
                        <Text style={styles.paragraph}>
                            All your health data is stored locally on your device. We do not collect, store, or transmit your personal health information to any external servers.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data Usage</Text>
                        <Text style={styles.paragraph}>
                            Your health data is used solely for calculating your biological age and providing personalized recommendations. This processing happens entirely on your device.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data Security</Text>
                        <Text style={styles.paragraph}>
                            We take data security seriously. Your health information is stored securely using industry-standard encryption methods.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data Deletion</Text>
                        <Text style={styles.paragraph}>
                            You can delete all your health data at any time from the Profile screen. Once deleted, this information cannot be recovered.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Third-Party Services</Text>
                        <Text style={styles.paragraph}>
                            This app does not share your data with any third-party services or analytics providers.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Medical Disclaimer</Text>
                        <Text style={styles.paragraph}>
                            BioAge Calculator is designed for educational and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                        </Text>
                        <Text style={styles.paragraph}>
                            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Us</Text>
                        <Text style={styles.paragraph}>
                            If you have any questions about our privacy practices or how we handle your data, please contact us at:
                        </Text>
                        <Text style={styles.contactEmail}>privacy@bioagecalculator.com</Text>
                    </View>

                    <Text style={styles.lastUpdated}>Last updated: June 2023</Text>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: 12,
    },
    contactEmail: {
        fontSize: 14,
        color: Colors.primary,
        marginTop: 8,
    },
    lastUpdated: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 16,
        textAlign: 'center',
    },
});