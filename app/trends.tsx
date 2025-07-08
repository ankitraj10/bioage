import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar, TrendingDown, TrendingUp } from 'lucide-react-native';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import useHealthStore from '@/store/health-store';
import useCalculateHealthStore from '@/store/calculate-health';
import useAuthStore from '@/store/auth-store';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 200;

export default function TrendsScreen() {
    const { results, fetchHistory, history } = useCalculateHealthStore();
    const { isAuthenticated } = useAuthStore();
    const { user } = useAuthStore();
    // const { bioAgeResults } = useHealthStore();
    // const bioAgeResults = results;
    const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('all');
    const [chartData, setChartData] = useState<any[]>([]);
    const [bioAgeResults, setBioAgeHistory] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated) {
                const userId = user?.id || "";
                const historyResult = await fetchHistory(userId);
                console.log("history bioage", historyResult)
                setBioAgeHistory(historyResult)
                console.log("new value 123", historyResult);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (history.length === 0) return;

        // Filter results based on time range
        const now = new Date();
        let filteredResults = [...history];

        if (timeRange === '3m') {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(now.getMonth() - 3);
            filteredResults = history.filter(result => new Date(result.date) >= threeMonthsAgo);
        } else if (timeRange === '6m') {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(now.getMonth() - 6);
            filteredResults = history.filter(result => new Date(result.date) >= sixMonthsAgo);
        } else if (timeRange === '1y') {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            filteredResults = history.filter(result => new Date(result.date) >= oneYearAgo);
        }

        // Reverse to get chronological order
        const chronologicalResults = [...filteredResults].reverse();
        setChartData(chronologicalResults);

    }, [history, timeRange]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getMinMaxValues = () => {
        if (chartData.length === 0) return { min: 20, max: 80 };

        let min = Math.min(...chartData.map(result => result.biologicalAge));
        let max = Math.max(...chartData.map(result => result.biologicalAge));

        // Add some padding
        min = Math.max(min - 5, 0);
        max = max + 5;

        return { min, max };
    };

    const { min, max } = getMinMaxValues();
    const range = max - min;

    const getYPosition = (value: number) => {
        return CHART_HEIGHT - ((value - min) / range) * CHART_HEIGHT;
    };

    const getOverallTrend = () => {
        if (chartData.length < 2) return 'neutral';

        const firstResult = chartData[0];
        const lastResult = chartData[chartData.length - 1];

        if (lastResult.biologicalAge < firstResult.biologicalAge) {
            return 'improving';
        } else if (lastResult.biologicalAge > firstResult.biologicalAge) {
            return 'declining';
        } else {
            return 'neutral';
        }
    };

    const getTrendColor = () => {
        const trend = getOverallTrend();
        if (trend === 'improving') return Colors.success;
        if (trend === 'declining') return Colors.error;
        return Colors.textSecondary;
    };

    const getTrendIcon = () => {
        const trend = getOverallTrend();
        if (trend === 'improving') return <TrendingDown size={20} color={Colors.success} />;
        if (trend === 'declining') return <TrendingUp size={20} color={Colors.error} />;
        return null;
    };

    const getTrendText = () => {
        if (chartData.length < 2) return 'Complete more assessments to see your trend';

        const trend = getOverallTrend();
        if (trend === 'improving') {
            const improvement = chartData[0].biologicalAge - chartData[chartData.length - 1].biologicalAge;
            return `Your biological age has decreased by ${improvement.toFixed(1)} years`;
        }
        if (trend === 'declining') {
            const decline = chartData[chartData.length - 1].biologicalAge - chartData[0].biologicalAge;
            return `Your biological age has increased by ${decline.toFixed(1)} years`;
        }
        return 'Your biological age has remained stable';
    };

    return (
        <>
            <Stack.Screen options={{
                title: 'Trends & Analysis',
                headerBackTitle: 'profile',
            }} />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Biological Age Trends</Text>
                        <Text style={styles.subtitle}>
                            Track how your biological age changes over time
                        </Text>
                    </View>

                    <View style={styles.timeRangeContainer}>
                        <TouchableOpacity
                            style={[styles.timeRangeButton, timeRange === '3m' && styles.timeRangeButtonActive]}
                            onPress={() => setTimeRange('3m')}
                        >
                            <Text
                                style={[
                                    styles.timeRangeText,
                                    timeRange === '3m' && styles.timeRangeTextActive
                                ]}
                            >
                                3M
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.timeRangeButton, timeRange === '6m' && styles.timeRangeButtonActive]}
                            onPress={() => setTimeRange('6m')}
                        >
                            <Text
                                style={[
                                    styles.timeRangeText,
                                    timeRange === '6m' && styles.timeRangeTextActive
                                ]}
                            >
                                6M
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.timeRangeButton, timeRange === '1y' && styles.timeRangeButtonActive]}
                            onPress={() => setTimeRange('1y')}
                        >
                            <Text
                                style={[
                                    styles.timeRangeText,
                                    timeRange === '1y' && styles.timeRangeTextActive
                                ]}
                            >
                                1Y
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.timeRangeButton, timeRange === 'all' && styles.timeRangeButtonActive]}
                            onPress={() => setTimeRange('all')}
                        >
                            <Text
                                style={[
                                    styles.timeRangeText,
                                    timeRange === 'all' && styles.timeRangeTextActive
                                ]}
                            >
                                All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {history.length === 0 ? (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyTitle}>No Data Available</Text>
                            <Text style={styles.emptyText}>
                                Complete your first biological age assessment to start tracking your trends.
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
                            <Card variant="elevated" style={styles.chartCard}>
                                <View style={styles.chartHeader}>
                                    <Text style={styles.chartTitle}>Biological Age Over Time</Text>
                                    <View style={styles.legendContainer}>
                                        <View style={styles.legendItem}>
                                            <View style={[styles.legendColor, { backgroundColor: Colors.chart.bioAge }]} />
                                            <Text style={styles.legendText}>Biological Age</Text>
                                        </View>
                                        <View style={styles.legendItem}>
                                            <View style={[styles.legendColor, { backgroundColor: Colors.chart.chronoAge }]} />
                                            <Text style={styles.legendText}>Chronological Age</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.chartContainer}>
                                    {/* Y-axis labels */}
                                    <View style={styles.yAxisLabels}>
                                        <Text style={styles.axisLabel}>{max.toFixed(0)}</Text>
                                        <Text style={styles.axisLabel}>{((max + min) / 2).toFixed(0)}</Text>
                                        <Text style={styles.axisLabel}>{min.toFixed(0)}</Text>
                                    </View>

                                    {/* Chart area */}
                                    <View style={styles.chart}>
                                        {/* Grid lines */}
                                        <View style={[styles.gridLine, { top: 0 }]} />
                                        <View style={[styles.gridLine, { top: CHART_HEIGHT / 2 }]} />
                                        <View style={[styles.gridLine, { top: CHART_HEIGHT }]} />

                                        {/* Data lines */}
                                        {chartData.length > 1 && (
                                            <>
                                                {/* Biological Age line */}
                                                <View style={styles.lineContainer}>
                                                    {chartData.map((result, index) => {
                                                        if (index === 0) return null;

                                                        const startX = ((index - 1) / (chartData.length - 1)) * CHART_WIDTH;
                                                        const endX = (index / (chartData.length - 1)) * CHART_WIDTH;
                                                        const startY = getYPosition(chartData[index - 1].biologicalAge);
                                                        const endY = getYPosition(result.biologicalAge);

                                                        return (
                                                            <View
                                                                key={`bio-${index}`}
                                                                style={[
                                                                    styles.line,
                                                                    {
                                                                        left: startX,
                                                                        top: startY,
                                                                        width: endX - startX,
                                                                        height: 2,
                                                                        transform: [
                                                                            {
                                                                                rotate: `${Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}deg`
                                                                            },
                                                                            { translateY: (endY - startY) / 2 }
                                                                        ],
                                                                        backgroundColor: Colors.chart.bioAge
                                                                    }
                                                                ]}
                                                            />
                                                        );
                                                    })}
                                                </View>

                                                {/* Chronological Age line */}
                                                <View style={styles.lineContainer}>
                                                    {chartData.map((result, index) => {
                                                        if (index === 0) return null;

                                                        const startX = ((index - 1) / (chartData.length - 1)) * CHART_WIDTH;
                                                        const endX = (index / (chartData.length - 1)) * CHART_WIDTH;
                                                        const startY = getYPosition(chartData[index - 1].chronologicalAge);
                                                        const endY = getYPosition(result.chronologicalAge);

                                                        return (
                                                            <View
                                                                key={`chrono-${index}`}
                                                                style={[
                                                                    styles.line,
                                                                    {
                                                                        left: startX,
                                                                        top: startY,
                                                                        width: endX - startX,
                                                                        height: 2,
                                                                        transform: [
                                                                            {
                                                                                rotate: `${Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}deg`
                                                                            },
                                                                            { translateY: (endY - startY) / 2 }
                                                                        ],
                                                                        backgroundColor: Colors.chart.chronoAge
                                                                    }
                                                                ]}
                                                            />
                                                        );
                                                    })}
                                                </View>
                                            </>
                                        )}

                                        {/* Data points */}
                                        {chartData.map((result, index) => {
                                            const x = (index / (chartData.length - 1)) * CHART_WIDTH;
                                            const bioY = getYPosition(result.biologicalAge);
                                            const chronoY = getYPosition(result.chronologicalAge);

                                            return (
                                                <React.Fragment key={`points-${index}`}>
                                                    <View
                                                        style={[
                                                            styles.dataPoint,
                                                            {
                                                                left: x - 4,
                                                                top: bioY - 4,
                                                                backgroundColor: Colors.chart.bioAge
                                                            }
                                                        ]}
                                                    />
                                                    <View
                                                        style={[
                                                            styles.dataPoint,
                                                            {
                                                                left: x - 4,
                                                                top: chronoY - 4,
                                                                backgroundColor: Colors.chart.chronoAge
                                                            }
                                                        ]}
                                                    />
                                                </React.Fragment>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* X-axis labels */}
                                <View style={styles.xAxisLabels}>
                                    {chartData.map((result, index) => {
                                        if (chartData.length > 6 && index % Math.ceil(chartData.length / 6) !== 0 && index !== chartData.length - 1) {
                                            return null;
                                        }

                                        const x = (index / (chartData.length - 1)) * CHART_WIDTH;

                                        return (
                                            <Text
                                                key={`x-label-${index}`}
                                                style={[
                                                    styles.xAxisLabel,
                                                    { left: x - 20 }
                                                ]}
                                            >
                                                {formatDate(result.date)}
                                            </Text>
                                        );
                                    })}
                                </View>
                            </Card>

                            <Card style={styles.trendCard}>
                                <View style={styles.trendHeader}>
                                    <Calendar size={20} color={Colors.primary} />
                                    <Text style={styles.trendTitle}>Overall Trend</Text>
                                    {getTrendIcon()}
                                </View>
                                <Text style={[styles.trendText, { color: getTrendColor() }]}>
                                    {getTrendText()}
                                </Text>
                            </Card>

                            <Text style={styles.sectionTitle}>Key Metrics</Text>

                            <View style={styles.metricsContainer}>
                                <Card style={styles.metricCard}>
                                    <Text style={styles.metricValue}>
                                        {chartData.length > 0 ? chartData[chartData.length - 1].biologicalAge.toFixed(1) : '-'}
                                    </Text>
                                    <Text style={styles.metricLabel}>Current Bio Age</Text>
                                </Card>

                                <Card style={styles.metricCard}>
                                    <Text style={styles.metricValue}>
                                        {chartData.length > 0 ? chartData[chartData.length - 1].chronologicalAge.toFixed(0) : '-'}
                                    </Text>
                                    <Text style={styles.metricLabel}>Chronological Age</Text>
                                </Card>

                                <Card style={styles.metricCard}>
                                    <Text style={styles.metricValue}>
                                        {chartData.length > 0
                                            ? (chartData[chartData.length - 1].chronologicalAge - chartData[chartData.length - 1].biologicalAge).toFixed(1)
                                            : '-'}
                                    </Text>
                                    <Text style={styles.metricLabel}>Age Difference</Text>
                                </Card>

                                <Card style={styles.metricCard}>
                                    <Text style={styles.metricValue}>
                                        {chartData.length}
                                    </Text>
                                    <Text style={styles.metricLabel}>Assessments</Text>
                                </Card>
                            </View>

                            <Text style={styles.sectionTitle}>Health Scores Trend</Text>

                            <Card style={styles.scoresCard}>
                                <View style={styles.scoreItem}>
                                    <View style={styles.scoreHeader}>
                                        <Text style={styles.scoreName}>Bloodwork</Text>
                                        <Text style={styles.scoreValue}>
                                            {chartData.length > 0
                                                ? `${(chartData[chartData.length - 1].bloodworkScore * 100).toFixed(0)}%`
                                                : '-'}
                                        </Text>
                                    </View>
                                    <View style={styles.scoreBar}>
                                        <View
                                            style={[
                                                styles.scoreBarFill,
                                                {
                                                    width: chartData.length > 0
                                                        ? `${chartData[chartData.length - 1].bloodworkScore * 100}%`
                                                        : '0%'
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>

                                <View style={styles.scoreItem}>
                                    <View style={styles.scoreHeader}>
                                        <Text style={styles.scoreName}>Lifestyle</Text>
                                        <Text style={styles.scoreValue}>
                                            {chartData.length > 0
                                                ? `${(chartData[chartData.length - 1].lifestyleScore * 100).toFixed(0)}%`
                                                : '-'}
                                        </Text>
                                    </View>
                                    <View style={styles.scoreBar}>
                                        <View
                                            style={[
                                                styles.scoreBarFill,
                                                {
                                                    width: chartData.length > 0
                                                        ? `${chartData[chartData.length - 1].lifestyleScore * 100}%`
                                                        : '0%',
                                                    backgroundColor: Colors.secondary
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>

                                <View style={styles.scoreItem}>
                                    <View style={styles.scoreHeader}>
                                        <Text style={styles.scoreName}>Vitals</Text>
                                        <Text style={styles.scoreValue}>
                                            {chartData.length > 0
                                                ? `${(chartData[chartData.length - 1].vitalScore * 100).toFixed(0)}%`
                                                : '-'}
                                        </Text>
                                    </View>
                                    <View style={styles.scoreBar}>
                                        <View
                                            style={[
                                                styles.scoreBarFill,
                                                {
                                                    width: chartData.length > 0
                                                        ? `${chartData[chartData.length - 1].vitalScore * 100}%`
                                                        : '0%',
                                                    backgroundColor: Colors.primaryLight
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            </Card>
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
    timeRangeContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: Colors.card,
        borderRadius: 8,
        padding: 4,
    },
    timeRangeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    timeRangeButtonActive: {
        backgroundColor: Colors.primary,
    },
    timeRangeText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    timeRangeTextActive: {
        color: '#fff',
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
    chartCard: {
        padding: 16,
        marginBottom: 20,
    },
    chartHeader: {
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 4,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    chartContainer: {
        flexDirection: 'row',
        height: CHART_HEIGHT,
        marginBottom: 24,
    },
    yAxisLabels: {
        width: 30,
        height: CHART_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: 8,
    },
    axisLabel: {
        fontSize: 10,
        color: Colors.chart.axis,
    },
    chart: {
        flex: 1,
        height: CHART_HEIGHT,
        position: 'relative',
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: Colors.chart.grid,
    },
    lineContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    line: {
        position: 'absolute',
        height: 2,
    },
    dataPoint: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    xAxisLabels: {
        height: 20,
        position: 'relative',
    },
    xAxisLabel: {
        position: 'absolute',
        fontSize: 10,
        color: Colors.chart.axis,
        width: 40,
        textAlign: 'center',
    },
    trendCard: {
        padding: 16,
        marginBottom: 20,
    },
    trendHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    trendTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginLeft: 8,
        marginRight: 8,
    },
    trendText: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        gap: 12,
    },
    metricCard: {
        width: (width - 44) / 2,
        padding: 16,
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    scoresCard: {
        padding: 16,
        marginBottom: 20,
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
});