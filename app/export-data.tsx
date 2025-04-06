import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, Share2, FileText, FileCsv, FileJson } from 'lucide-react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import useHealthStore from '@/store/health-store';
import useAuthStore from '@/store/auth-store';

export default function ExportDataScreen() {
    const { bioAgeResults, bloodwork, lifestyle, vitals } = useHealthStore();
    const { user } = useAuthStore();
    const [isExporting, setIsExporting] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
    };

    const generateCSV = () => {
        // Header row
        let csv = 'Date,Chronological Age,Biological Age,Bloodwork Score,Lifestyle Score,Vital Score,Overall Health\n';

        // Data rows
        bioAgeResults.forEach(result => {
            csv += `${formatDate(result.date)},${result.chronologicalAge},${result.biologicalAge},${result.bloodworkScore},${result.lifestyleScore},${result.vitalScore},${result.overallHealth}\n`;
        });

        return csv;
    };

    const generateJSON = () => {
        const data = {
            user: {
                id: user?.id,
                name: user?.name,
                email: user?.email,
                dateOfBirth: user?.dateOfBirth,
                gender: user?.gender,
                height: user?.height,
                weight: user?.weight
            },
            bioAgeResults,
            bloodwork,
            lifestyle,
            vitals,
            exportDate: new Date().toISOString()
        };

        return JSON.stringify(data, null, 2);
    };

    const generateReport = () => {
        let report = `BioAge Health Report\n`;
        report += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

        report += `User: ${user?.name || 'Anonymous'}\n`;
        if (user?.dateOfBirth) {
            report += `Date of Birth: ${formatDate(user.dateOfBirth)}\n`;
        }
        if (user?.gender) {
            report += `Gender: ${user.gender}\n`;
        }
        if (user?.height) {
            report += `Height: ${user.height} cm\n`;
        }
        if (user?.weight) {
            report += `Weight: ${user.weight} kg\n`;
        }

        report += `\nBioAge Assessment History:\n`;
        bioAgeResults.forEach((result, index) => {
            report += `\nAssessment #${index + 1} - ${formatDate(result.date)}\n`;
            report += `Chronological Age: ${result.chronologicalAge}\n`;
            report += `Biological Age: ${result.biologicalAge}\n`;
            report += `Overall Health: ${result.overallHealth}\n`;
            report += `Bloodwork Score: ${(result.bloodworkScore * 100).toFixed(0)}%\n`;
            report += `Lifestyle Score: ${(result.lifestyleScore * 100).toFixed(0)}%\n`;
            report += `Vital Score: ${(result.vitalScore * 100).toFixed(0)}%\n`;

            report += `\nRecommendations:\n`;
            result.recommendations.forEach((rec, recIndex) => {
                report += `${recIndex + 1}. ${rec.title} (${rec.category}) - ${rec.priority} Priority\n`;
                report += `   ${rec.description}\n`;
                report += `   Potential Impact: ${rec.impact} years\n\n`;
            });
        });

        return report;
    };

    const handleExport = async (format: 'csv' | 'json' | 'report') => {
        if (bioAgeResults.length === 0) {
            Alert.alert('No Data', 'You need to complete at least one assessment before exporting data.');
            return;
        }

        setIsExporting(true);

        try {
            let content = '';
            let fileName = '';
            let title = '';

            if (format === 'csv') {
                content = generateCSV();
                fileName = `bioage_data_${formatDate(new Date().toISOString())}.csv`;
                title = 'BioAge CSV Data';
            } else if (format === 'json') {
                content = generateJSON();
                fileName = `bioage_data_${formatDate(new Date().toISOString())}.json`;
                title = 'BioAge JSON Data';
            } else {
                content = generateReport();
                fileName = `bioage_report_${formatDate(new Date().toISOString())}.txt`;
                title = 'BioAge Health Report';
            }

            if (Platform.OS === 'web') {
                Alert.alert('Export Not Available', 'Data export is not available on web. Please use the mobile app.');
            } else {
                const result = await Share.share({
                    message: content,
                    title: title,
                });

                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        console.log(`Shared with activity type: ${result.activityType}`);
                    } else {
                        console.log('Shared successfully');
                    }
                } else if (result.action === Share.dismissedAction) {
                    console.log('Share dismissed');
                }
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            Alert.alert('Export Failed', 'There was an error exporting your data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Export Data' }} />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Export Your Health Data</Text>
                        <Text style={styles.subtitle}>
                            Export your BioAge data in different formats for your records or to share with healthcare providers.
                        </Text>
                    </View>

                    <Card variant="elevated" style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <FileText size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.cardTitleContainer}>
                                <Text style={styles.cardTitle}>Health Report</Text>
                                <Text style={styles.cardSubtitle}>
                                    A comprehensive text report of your biological age assessments and recommendations.
                                </Text>
                            </View>
                        </View>
                        <Button
                            title="Export Report"
                            onPress={() => handleExport('report')}
                            variant="outline"
                            loading={isExporting}
                            disabled={isExporting || bioAgeResults.length === 0}
                            fullWidth
                            icon={<Download size={18} color={Colors.primary} />}
                            iconPosition="left"
                        />
                    </Card>

                    <Card variant="elevated" style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <FileCsv size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.cardTitleContainer}>
                                <Text style={styles.cardTitle}>CSV Format</Text>
                                <Text style={styles.cardSubtitle}>
                                    Export your assessment data in CSV format for use in spreadsheet applications.
                                </Text>
                            </View>
                        </View>
                        <Button
                            title="Export CSV"
                            onPress={() => handleExport('csv')}
                            variant="outline"
                            loading={isExporting}
                            disabled={isExporting || bioAgeResults.length === 0}
                            fullWidth
                            icon={<Download size={18} color={Colors.primary} />}
                            iconPosition="left"
                        />
                    </Card>

                    <Card variant="elevated" style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <FileJson size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.cardTitleContainer}>
                                <Text style={styles.cardTitle}>JSON Format</Text>
                                <Text style={styles.cardSubtitle}>
                                    Export all your data including user profile, assessments, and health metrics in JSON format.
                                </Text>
                            </View>
                        </View>
                        <Button
                            title="Export JSON"
                            onPress={() => handleExport('json')}
                            variant="outline"
                            loading={isExporting}
                            disabled={isExporting || bioAgeResults.length === 0}
                            fullWidth
                            icon={<Download size={18} color={Colors.primary} />}
                            iconPosition="left"
                        />
                    </Card>

                    <Card variant="elevated" style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <Share2 size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.cardTitleContainer}>
                                <Text style={styles.cardTitle}>Share Latest Results</Text>
                                <Text style={styles.cardSubtitle}>
                                    Share your most recent biological age assessment with others.
                                </Text>
                            </View>
                        </View>
                        <Button
                            title="Share Results"
                            onPress={async () => {
                                if (bioAgeResults.length === 0) {
                                    Alert.alert('No Data', 'You need to complete at least one assessment before sharing results.');
                                    return;
                                }

                                const latestResult = bioAgeResults[0];
                                const message = `My BioAge Results:\n\nBiological Age: ${latestResult.biologicalAge}\nChronological Age: ${latestResult.chronologicalAge}\nOverall Health: ${latestResult.overallHealth}\n\nAssessed on: ${formatDate(latestResult.date)}`;

                                try {
                                    await Share.share({
                                        message,
                                        title: 'My BioAge Results',
                                    });
                                } catch (error) {
                                    console.error('Error sharing results:', error);
                                    Alert.alert('Share Failed', 'There was an error sharing your results. Please try again.');
                                }
                            }}
                            variant="primary"
                            disabled={bioAgeResults.length === 0}
                            fullWidth
                            icon={<Share2 size={18} color="#fff" />}
                            iconPosition="left"
                        />
                    </Card>

                    <View style={styles.disclaimer}>
                        <Text style={styles.disclaimerText}>
                            Your data privacy is important to us. Exported data may contain sensitive health information. Please be careful when sharing this information.
                        </Text>
                    </View>
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
        marginBottom: 24,
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
    card: {
        marginBottom: 16,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardTitleContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    disclaimer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: Colors.card,
        borderRadius: 8,
    },
    disclaimerText: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
});