import React, { useEffect, useState } from 'react';
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
import useCalculateHealthStore from '@/store/calculate-health';


export default function RecommendationsScreen() {
    const { isAuthenticated, user } = useAuthStore();
    const { bioAgeResults } = useHealthStore();
    const { results, fetchHistory } = useCalculateHealthStore();
    const [bioAgeHistory, setBioAgeHistory] = useState([]);
    const [recommendations, setRecommendation] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated) {
                const userId = user?.id || "";
                const historyResult = await fetchHistory(userId);
                console.log("history bioage trends", historyResult)
                setBioAgeHistory(historyResult)
                console.log("new value 987", historyResult);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (results?.length > 0) {
            setRecommendation(results);
        }
    }, [results]);

    useEffect(() => {
        if (results?.length == 0 && bioAgeHistory?.length > 0) {
            setRecommendation(bioAgeHistory);
        }
    }, [results, bioAgeHistory])

    console.log("test test", results)


    if (recommendations?.length === 0) {
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

    console.log("insight rsults", results, recommendations)

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <BioAgeCard result={recommendations[0]} />

                <View style={styles.recommendationsHeader}>
                    <Text style={styles.recommendationsTitle}>Personalized Recommendations</Text>
                    <Text style={styles.recommendationsSubtitle}>
                        Based on your health data, here are some suggestions to improve your biological age.
                    </Text>
                </View>

                {recommendations[0]?.recommendations.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
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