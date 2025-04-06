import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import Colors from '@/constants/colors';

export default function ModalScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1559757175-7cb036e0d465?q=80&w=1587&auto=format&fit=crop' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                <Text style={styles.title}>Understanding Biological Age</Text>

                <Text style={styles.paragraph}>
                    Biological age, also known as physiological age, refers to how old your body appears to be based on various biomarkers and health indicators, rather than just the number of years you've been alive (chronological age).
                </Text>

                <Text style={styles.sectionTitle}>Why It Matters</Text>
                <Text style={styles.paragraph}>
                    Your biological age can be a better predictor of health and longevity than your chronological age. People with younger biological ages tend to have lower risks of age-related diseases and longer lifespans.
                </Text>

                <Text style={styles.sectionTitle}>How We Calculate It</Text>
                <Text style={styles.paragraph}>
                    BioAge Calculator uses a comprehensive algorithm that analyzes three key areas:
                </Text>

                <View style={styles.bulletPoints}>
                    <View style={styles.bulletPoint}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>
                            <Text style={styles.bold}>Blood Biomarkers:</Text> Including glucose, cholesterol, and other key indicators from blood tests
                        </Text>
                    </View>

                    <View style={styles.bulletPoint}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>
                            <Text style={styles.bold}>Lifestyle Factors:</Text> Sleep quality, exercise habits, diet, stress levels, and other daily behaviors
                        </Text>
                    </View>

                    <View style={styles.bulletPoint}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>
                            <Text style={styles.bold}>Vital Signs:</Text> Blood pressure, resting heart rate, BMI, and other physical measurements
                        </Text>
                    </View>
                </View>

                <Text style={styles.paragraph}>
                    Our algorithm weighs these factors based on their scientific correlation with aging and longevity research to provide you with an accurate biological age estimate.
                </Text>

                <Text style={styles.sectionTitle}>Improving Your Biological Age</Text>
                <Text style={styles.paragraph}>
                    The good news is that biological age is not fixed. Unlike chronological age, you can actually reduce your biological age through lifestyle changes, proper nutrition, regular exercise, stress management, and other health interventions.
                </Text>

                <Text style={styles.paragraph}>
                    BioAge Calculator provides personalized recommendations based on your specific results to help you optimize your health and potentially reduce your biological age over time.
                </Text>

                <Text style={styles.disclaimer}>
                    Note: This app is for informational purposes only and is not intended to replace professional medical advice. Always consult with healthcare professionals for medical concerns.
                </Text>
            </ScrollView>
        </View>
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
    imageContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 24,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: 12,
    },
    bulletPoints: {
        marginVertical: 12,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginTop: 8,
        marginRight: 8,
    },
    bulletText: {
        flex: 1,
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    bold: {
        fontWeight: '600',
        color: Colors.text,
    },
    disclaimer: {
        fontSize: 12,
        color: Colors.textLight,
        fontStyle: 'italic',
        marginTop: 24,
        padding: 12,
        backgroundColor: Colors.card,
        borderRadius: 8,
        lineHeight: 18,
    },
});