import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react-native';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import useAuthStore from '@/store/auth-store';
import useHealthStore from '@/store/health-store';

export default function HistoryScreen() {
    const { isAuthenticated } = useAuthStore();
    const { bioAgeResults } = useHealthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)');
        }
    }, [isAuthenticated]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getChangeIcon = (current: number, previous: number | null) => {
        if (!previous) return <Minus size={16} color={Colors.textLight} />;

        const diff = current - previous;
        if (Math.abs(diff) < 0.1) return <Minus size={16} color={Colors.textLight} />;

        if (diff < 0) {
            // Biological age decreased (improvement)
            return <ArrowDown size={16} color={Colors.success} />;
        } else {
            // Biological age increased (decline)
            return <ArrowUp size={16} color={Colors.error} />;
        }
    };

    const getChangeText = (current: number, previous: number | null) => {
        if (!previous) return 'Baseline';

        const diff = current - previous;
        if (Math.abs(diff) < 0.1) return 'No change';

        const formattedDiff = Math.abs(diff).toFixed(1);

        if (diff < 0) {
            return `${formattedDiff} years younger`;
        } else {
            return `${formattedDiff} years older`;
        }
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
            <Stack.Screen options={{ title: 'Bio Age History' }} />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Your Bio Age Journey</Text>
                        <Text style={styles.subtitle}>
                            Track how your biological age changes over time
                        </Text>
                    </View>

                    {bioAgeResults.length === 0 ? (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyTitle}>No History Yet</Text>
                            <Text style={styles.emptyText}>
                                Complete your first biological age assessment to start tracking your progress.
                            </Text>
                            <TouchableOpacity
                                style={styles.calculateButton}
                                onPress={() => router.push('/calculator')}
                            >
                                <Text style={styles.calculateButtonText}>Calculate Now</Text>
                            </TouchableOpacity>
                        </Card>
                    ) : (
                        <>
                            <View style={styles.trendCard}>
                                <Text style={styles.trendTitle}>Overall Trend</Text>
                                <View style={styles.trendGraph}>
                                    {bioAgeResults.slice(0, 5).reverse().map((result, index) => {
                                        const height = 100 - ((result.biologicalAge - 20) * 4);
                                        return (
                                            <View key={result.id} style={styles.trendBarContainer}>
                                                <View style={[styles.trendBar, { height: `${Math.min(Math.max(height, 10), 100)}%` }]} />
                                                <Text style={styles.trendBarLabel}>{formatDate(result.date).split(' ')[0]}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            <Text style={styles.historyTitle}>Assessment History</Text>

                            {bioAgeResults.map((result, index) => {
                                const previousResult = index < bioAgeResults.length - 1 ? bioAgeResults[index + 1] : null;

                                return (
                                    <Card key={result.id} style={styles.historyCard}>
                                        <View style={styles.historyCardHeader}>
                                            <Text style={styles.historyDate}>{formatDate(result.date)}</Text>
                                            <View
                                                style={[
                                                    styles.healthStatusBadge,
                                                    { backgroundColor: getHealthStatusColor(result.overallHealth) }
                                                ]}
                                            >
                                                <Text style={styles.healthStatusText}>{result.overallHealth}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.ageContainer}>
                                            <View style={styles.ageItem}>
                                                <Text style={styles.ageLabel}>Biological Age</Text>
                                                <Text style={styles.ageValue}>{result.biologicalAge}</Text>
                                            </View>

                                            <View style={styles.ageDivider} />

                                            <View style={styles.ageItem}>
                                                <Text style={styles.ageLabel}>Chronological Age</Text>
                                                <Text style={styles.ageValue}>{result.chronologicalAge}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.changeContainer}>
                                            {getChangeIcon(result.biologicalAge, previousResult?.biologicalAge)}
                                            <Text style={styles.changeText}>
                                                {getChangeText(result.biologicalAge, previousResult?.biologicalAge)}
                                            </Text>
                                        </View>

                                        <View style={styles.scoreContainer}>
                                            <View style={styles.scoreItem}>
                                                <View style={styles.scoreBar}>
                                                    <View
                                                        style={[
                                                            styles.scoreBarFill,
                                                            { width: `${result.bloodworkScore * 100}%` }
                                                        ]}
                                                    />
                                                </View>
                                                <Text style={styles.scoreLabel}>Bloodwork</Text>
                                            </View>

                                            <View style={styles.scoreItem}>
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
                                                <Text style={styles.scoreLabel}>Lifestyle</Text>
                                            </View>

                                            <View style={styles.scoreItem}>
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
                                                <Text style={styles.scoreLabel}>Vitals</Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.viewDetailsButton}
                                            onPress={() => router.push({ pathname: '/result-details', params: { id: result.id } })}
                                        >
                                            <Text style={styles.viewDetailsText}>View Details</Text>
                                        </TouchableOpacity>
                                    </Card>
                                );
                            })}
                        </>
                    )}
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
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    emptyCard: {
        padding: 24,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    calculateButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        borderRadius: 8,
    },
    calculateButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    trendCard: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    trendTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    trendGraph: {
        flexDirection: 'row',
        height: 150,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 24,
    },
    trendBarContainer: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
    },
    trendBar: {
        width: 20,
        backgroundColor: Colors.primary,
        borderRadius: 4,
        marginBottom: 8,
    },
    trendBarLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        position: 'absolute',
        bottom: 0,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    historyCard: {
        marginBottom: 12,
    },
    historyCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    historyDate: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    healthStatusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    healthStatusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    ageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    ageItem: {
        flex: 1,
        alignItems: 'center',
    },
    ageLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    ageValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.primary,
    },
    ageDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.border,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: Colors.card,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignSelf: 'center',
    },
    changeText: {
        fontSize: 12,
        color: Colors.text,
        marginLeft: 4,
    },
    scoreContainer: {
        gap: 8,
        marginBottom: 12,
    },
    scoreItem: {
        marginBottom: 4,
    },
    scoreBar: {
        height: 6,
        backgroundColor: Colors.border,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    scoreBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    scoreLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
    },
    viewDetailsButton: {
        alignSelf: 'center',
    },
    viewDetailsText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
});