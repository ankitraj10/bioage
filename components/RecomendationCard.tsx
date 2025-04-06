import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Recommendation } from '@/types/health';
import Card from './Card';
import {
    Activity,
    Apple,
    Stethoscope,
    Dumbbell,
    AlertTriangle,
    Info,
    CheckCircle
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface RecommendationCardProps {
    recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
    recommendation
}) => {
    const getCategoryIcon = () => {
        switch (recommendation.category) {
            case 'Lifestyle':
                return <Activity size={24} color={Colors.primary} />;
            case 'Nutrition':
                return <Apple size={24} color={Colors.secondary} />;
            case 'Medical':
                return <Stethoscope size={24} color={Colors.error} />;
            case 'Exercise':
                return <Dumbbell size={24} color={Colors.primaryLight} />;
            default:
                return <Info size={24} color={Colors.textSecondary} />;
        }
    };

    const getPriorityIcon = () => {
        switch (recommendation.priority) {
            case 'High':
                return <AlertTriangle size={16} color={Colors.error} />;
            case 'Medium':
                return <Info size={16} color={Colors.warning} />;
            case 'Low':
                return <CheckCircle size={16} color={Colors.success} />;
            default:
                return null;
        }
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    {getCategoryIcon()}
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{recommendation.title}</Text>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.category}>{recommendation.category}</Text>
                        <View style={styles.priorityContainer}>
                            {getPriorityIcon()}
                            <Text style={styles.priority}>{recommendation.priority} Priority</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Text style={styles.description}>{recommendation.description}</Text>

            <View style={styles.impactContainer}>
                <Text style={styles.impactLabel}>Potential Impact:</Text>
                <Text style={styles.impactValue}>
                    {recommendation.impact > 0
                        ? `Reduce biological age by ~${recommendation.impact} years`
                        : 'Maintain current biological age'}
                </Text>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    category: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginRight: 8,
    },
    priorityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priority: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginLeft: 4,
    },
    description: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 12,
        lineHeight: 20,
    },
    impactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    impactLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginRight: 4,
    },
    impactValue: {
        fontSize: 12,
        color: Colors.text,
    },
});

export default RecommendationCard;