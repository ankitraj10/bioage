import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BioAgeResult } from '@/types/health';
import Card from './Card';
import Colors from '@/constants/colors';

interface BioAgeCardProps {
    result: BioAgeResult;
}

const BioAgeCard: React.FC<BioAgeCardProps> = ({ result }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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

    const getAgeDifference = () => {
        const diff = result.chronologicalAge - result.biologicalAge;
        if (Math.abs(diff) < 0.5) return 'on par with';
        return diff > 0 ? 'younger than' : 'older than';
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Biological Age Assessment</Text>
                <Text style={styles.date}>{formatDate(result.date)}</Text>
            </View>

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

            <Text style={styles.ageSummary}>
                Your body is functioning as if you are{' '}
                <Text style={styles.highlight}>
                    {getAgeDifference()}{' '}
                    your actual age
                </Text>
            </Text>

            <View style={styles.healthStatusContainer}>
                <Text style={styles.healthStatusLabel}>Overall Health:</Text>
                <View
                    style={[
                        styles.healthStatusBadge,
                        { backgroundColor: getHealthStatusColor(result.overallHealth) }
                    ]}
                >
                    <Text style={styles.healthStatusText}>{result.overallHealth}</Text>
                </View>
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
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    date: {
        fontSize: 12,
        color: Colors.textSecondary,
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
    ageSummary: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    highlight: {
        fontWeight: '600',
        color: Colors.text,
    },
    healthStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    healthStatusLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginRight: 8,
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
    scoreContainer: {
        gap: 12,
    },
    scoreItem: {
        marginBottom: 8,
    },
    scoreBar: {
        height: 8,
        backgroundColor: Colors.border,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    scoreBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    scoreLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});

export default BioAgeCard;