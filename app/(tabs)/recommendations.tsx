import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import BioAgeCard from '@/components/BioAgeCard';
import RecommendationCard from '@/components/RecomendationCard';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import useAuthStore from '@/store/auth-store';
import useHealthStore from '@/store/health-store';

export default function RecommendationsScreen() {
    const { isAuthenticated } = useAuthStore();
    const { bioAgeResults } = useHealthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)');
        }
    }, [isAuthenticated]);

    const latestResult = bioAgeResults.length > 0 ? bioAgeResults[0] : null;

    if (!latestResult) {
        return (
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No Results Yet</Text>
                    <Text style={styles.emptyText}>
                        Complete the biological age assessment to get personalized recommendations.
                    </Text>
                    <Button
                        title="Calculate Your Biological Age"
                        onPress={() => router.push('/calculator')}
                        variant="primary"
                        size="large"
                        fullWidth
                        style={styles.calculateButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <BioAgeCard result={latestResult} />

                <View style={styles.recommendationsHeader}>
                    <Text style={styles.recommendationsTitle}>Personalized Recommendations</Text>
                    <Text style={styles.recommendationsSubtitle}>
                        Based on your health data, here are some suggestions to improve your biological age.
                    </Text>
                </View>

                {latestResult.recommendations.map(recommendation => (
                    <RecommendationCard
                        key={recommendation.id}
                        recommendation={recommendation}
                    />
                ))}

                <View style={styles.actionContainer}>
                    <Button
                        title="Recalculate"
                        onPress={() => router.push('/calculator')}
                        variant="primary"
                        fullWidth
                        style={styles.actionButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
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
    emptyContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    calculateButton: {
        marginTop: 8,
    },
    recommendationsHeader: {
        marginTop: 24,
        marginBottom: 16,
    },
    recommendationsTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    recommendationsSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
        lineHeight: 20,
    },
    actionContainer: {
        marginTop: 24,
        marginBottom: 16,
    },
    actionButton: {
        marginBottom: 8,
    },
});