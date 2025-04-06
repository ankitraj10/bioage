import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/Card';
import RecommendationCard from '@/components/RecomendationCard';
import Colors from '@/constants/colors';
import useHealthStore from '@/store/health-store';

export default function ResultDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { bioAgeResults } = useHealthStore();

    const result = bioAgeResults.find(r => r.id === id);

    if (!result) {
        return (
            <>
                <Stack.Screen options={{ title: 'Result Details' }} />
                <SafeAreaView style={styles.container} edges={['bottom']}>
                    <View style={styles.notFoundContainer}>
                        <Text style={styles.notFoundText}>Result not found</Text>
                    </View>
                </SafeAreaView>
            </>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'Excellent':
                return Colors.success;
            case 'Good':
                return Colors.secondary;
            case 'Fair':
                return Colors.warning;
            case 'Poor':
                return Colors.error;
            default:
                return Colors.textSecondary;
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Assessment Details' }} />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.date}>{formatDate(result.date)}</Text>
                        <View
                            style={[
                                styles.healthStatusBadge,
                                { backgroundColor: getHealthStatusColor(result.overallHealth) }
                            ]}
                        >
                            <Text style={styles.healthStatusText}>{result.overallHealth}</Text>
                        </View>
                    </View>

                    <Card variant="elevated" style={styles.ageCard}>
                        <View style={styles.ageContainer}>
                            <View style={styles.ageBox}>
                                <Text style={styles.ageValue}>{result.biologicalAge}</Text>
                                <Text style={styles.ageLabel}>Biological Age</Text>
                            </View>

                            <View style={styles.ageDivider} />

                            <View style={styles.ageBox}>
                                <Text style={styles.ageValue}>{result.chronologicalAge}</Text>
                                <Text style={styles.ageLabel}>Chronological Age</Text>
                            </View>
                        </View>

                        <Text style={styles.ageDifference}>
                            {result.biologicalAge < result.chronologicalAge ? (
                                <Text>
                                    Your body is functioning <Text style={styles.highlight}>{(result.chronologicalAge - result.biologicalAge).toFixed(1)} years younger</Text> than your actual age
                                </Text>
                            ) : result.biologicalAge > result.chronologicalAge ? (
                                <Text>
                                    Your body is functioning <Text style={styles.highlight}>{(result.biologicalAge - result.chronologicalAge).toFixed(1)} years older</Text> than your actual age
                                </Text>
                            ) : (
                                <Text>
                                    Your biological age is <Text style={styles.highlight}>on par with</Text> your chronological age
                                </Text>
                            )}
                        </Text>
                    </Card>

                    <Text style={styles.sectionTitle}>Health Scores</Text>
                    <Card style={styles.scoresCard}>
                        <View style={styles.scoreItem}>
                            <View style={styles.scoreHeader}>
                                <Text style={styles.scoreName}>Bloodwork</Text>
                                <Text style={styles.scoreValue}>{(result.bloodworkScore * 100).toFixed(0)}%</Text>
                            </View>
                            <View style={styles.scoreBar}>
                                <View
                                    style={[
                                        styles.scoreBarFill,
                                        { width: `${result.bloodworkScore * 100}%` }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.scoreItem}>
                            <View style={styles.scoreHeader}>
                                <Text style={styles.scoreName}>Lifestyle</Text>
                                <Text style={styles.scoreValue}>{(result.lifestyleScore * 100).toFixed(0)}%</Text>
                            </View>
                            <View style={styles.scoreBar}>
                                <View
                                    style={[
                                        styles.scoreBarFill,
                                        {
                                            width: `${result.lifestyleScore * 100}%`,
                                            backgroundColor: Colors.secondary
                                        }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.scoreItem}>
                            <View style={styles.scoreHeader}>
                                <Text style={styles.scoreName}>Vitals</Text>
                                <Text style={styles.scoreValue}>{(result.vitalScore * 100).toFixed(0)}%</Text>
                            </View>
                            <View style={styles.scoreBar}>
                                <View
                                    style={[
                                        styles.scoreBarFill,
                                        {
                                            width: `${result.vitalScore * 100}%`,
                                            backgroundColor: Colors.primaryLight
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    </Card>

                    <Text style={styles.sectionTitle}>Recommendations</Text>
                    <Text style={styles.recommendationsSubtitle}>
                        Based on your assessment, here are personalized recommendations to improve your biological age:
                    </Text>

                    {result.recommendations.map(recommendation => (
                        <RecommendationCard
                            key={recommendation.id}
                            recommendation={recommendation}
                        />
                    ))}
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
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    date: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
    },
    healthStatusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    healthStatusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    ageCard: {
        padding: 20,
        marginBottom: 24,
    },
    ageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    ageBox: {
        flex: 1,
        alignItems: 'center',
    },
    ageDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.border,
        marginHorizontal: 16,
    },
    ageValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.primary,
    },
    ageLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    ageDifference: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    highlight: {
        fontWeight: '600',
        color: Colors.text,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    scoresCard: {
        padding: 16,
        marginBottom: 24,
    },
    scoreItem: {
        marginBottom: 16,
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    scoreName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    scoreValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    scoreBar: {
        height: 8,
        backgroundColor: Colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    scoreBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    recommendationsSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 16,
        lineHeight: 20,
    },
});