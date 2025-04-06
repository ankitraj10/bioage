import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Info, ArrowRight } from 'lucide-react-native';
import Card from '@/components/Card';
import BioAgeCard from '@/components/BioAgeCard';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import useAuthStore from '@/store/auth-store';
import useHealthStore from '@/store/health-store';

export default function DashboardScreen() {
    const { user, isAuthenticated } = useAuthStore();
    const { bioAgeResults } = useHealthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)');
        }
    }, [isAuthenticated]);

    const latestResult = bioAgeResults.length > 0 ? bioAgeResults[0] : null;

    const getGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) return 'Good Morning';
        if (hours < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.infoButton}
                        onPress={() => router.push('/modal')}
                    >
                        <Info size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {latestResult ? (
                    <>
                        <BioAgeCard result={latestResult} />

                        <View style={styles.actionsContainer}>
                            <Button
                                title="View Recommendations"
                                onPress={() => router.push('/recommendations')}
                                variant="primary"
                                fullWidth
                                style={styles.actionButton}
                            />
                            <Button
                                title="Recalculate"
                                onPress={() => router.push('/calculator')}
                                variant="outline"
                                fullWidth
                                style={styles.actionButton}
                            />
                        </View>
                    </>
                ) : (
                    <Card variant="elevated" style={styles.emptyStateCard}>
                        <Text style={styles.emptyStateTitle}>Welcome to BioAge</Text>
                        <Text style={styles.emptyStateText}>
                            Calculate your biological age to get personalized health insights and recommendations.
                        </Text>
                        <Button
                            title="Calculate Your Biological Age"
                            onPress={() => router.push('/calculator')}
                            variant="primary"
                            size="large"
                            fullWidth
                            style={styles.calculateButton}
                        />
                    </Card>
                )}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Health Insights</Text>
                </View>

                <Card style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <Text style={styles.insightTitle}>Complete Your Profile</Text>
                        <ArrowRight size={16} color={Colors.primary} />
                    </View>
                    <Text style={styles.insightText}>
                        Add your health metrics to get more accurate biological age calculations.
                    </Text>
                    <TouchableOpacity
                        style={styles.insightButton}
                        onPress={() => router.push('/profile')}
                    >
                        <Text style={styles.insightButtonText}>Update Profile</Text>
                    </TouchableOpacity>
                </Card>

                <Card style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <Text style={styles.insightTitle}>Track Your Progress</Text>
                        <ArrowRight size={16} color={Colors.primary} />
                    </View>
                    <Text style={styles.insightText}>
                        Regular assessments help you track improvements in your biological age over time.
                    </Text>
                    <TouchableOpacity
                        style={styles.insightButton}
                        onPress={() => router.push('/calculator')}
                    >
                        <Text style={styles.insightButtonText}>Start Assessment</Text>
                    </TouchableOpacity>
                </Card>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
    },
    infoButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.card,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsContainer: {
        marginTop: 16,
        marginBottom: 24,
    },
    actionButton: {
        marginBottom: 12,
    },
    emptyStateCard: {
        padding: 24,
        alignItems: 'center',
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    calculateButton: {
        marginTop: 8,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    insightCard: {
        marginBottom: 12,
    },
    insightHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    insightText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 16,
        lineHeight: 20,
    },
    insightButton: {
        alignSelf: 'flex-start',
    },
    insightButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
});