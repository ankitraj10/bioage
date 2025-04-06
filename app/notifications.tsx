import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, BellOff, Clock, Calendar, Activity, Droplets } from 'lucide-react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    icon: React.ReactNode;
    time?: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
}

export default function NotificationsScreen() {
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
        {
            id: 'assessment_reminder',
            title: 'Assessment Reminder',
            description: 'Remind me to recalculate my biological age',
            enabled: true,
            icon: <Calendar size={24} color={Colors.primary} />,
            frequency: 'monthly'
        },
        {
            id: 'daily_tips',
            title: 'Daily Health Tips',
            description: 'Receive daily tips to improve your biological age',
            enabled: true,
            icon: <Activity size={24} color={Colors.secondary} />,
            time: '09:00'
        },
        {
            id: 'water_reminder',
            title: 'Hydration Reminder',
            description: 'Remind me to drink water throughout the day',
            enabled: false,
            icon: <Droplets size={24} color={Colors.primaryLight} />,
            frequency: 'daily'
        },
        {
            id: 'progress_updates',
            title: 'Progress Updates',
            description: 'Weekly summary of your biological age progress',
            enabled: true,
            icon: <Activity size={24} color={Colors.chart.chronoAge} />,
            frequency: 'weekly'
        }
    ]);

    const [masterToggle, setMasterToggle] = useState(true);

    // Load saved notification settings
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedSettings = await AsyncStorage.getItem('notificationSettings');
                if (savedSettings) {
                    const parsedSettings = JSON.parse(savedSettings);
                    setNotificationSettings(parsedSettings);

                    // Check if all notifications are disabled
                    const allDisabled = parsedSettings.every((setting: NotificationSetting) => !setting.enabled);
                    setMasterToggle(!allDisabled);
                }
            } catch (error) {
                console.error('Error loading notification settings:', error);
            }
        };

        loadSettings();
    }, []);

    // Save notification settings when changed
    useEffect(() => {
        const saveSettings = async () => {
            try {
                await AsyncStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
            } catch (error) {
                console.error('Error saving notification settings:', error);
            }
        };

        saveSettings();
    }, [notificationSettings]);

    const toggleNotification = (id: string) => {
        setNotificationSettings(prev =>
            prev.map(setting =>
                setting.id === id
                    ? { ...setting, enabled: !setting.enabled }
                    : setting
            )
        );

        // Check if we need to update master toggle
        const updatedSettings = notificationSettings.map(setting =>
            setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
        );

        const allDisabled = updatedSettings.every(setting => !setting.enabled);
        if (allDisabled) {
            setMasterToggle(false);
        } else {
            setMasterToggle(true);
        }
    };

    const toggleAllNotifications = (value: boolean) => {
        setMasterToggle(value);
        setNotificationSettings(prev =>
            prev.map(setting => ({ ...setting, enabled: value }))
        );
    };

    const handleTimeChange = (id: string, time: string) => {
        setNotificationSettings(prev =>
            prev.map(setting =>
                setting.id === id
                    ? { ...setting, time }
                    : setting
            )
        );
    };

    const handleFrequencyChange = (id: string, frequency: 'daily' | 'weekly' | 'monthly') => {
        setNotificationSettings(prev =>
            prev.map(setting =>
                setting.id === id
                    ? { ...setting, frequency }
                    : setting
            )
        );
    };

    const requestPermissions = () => {
        // In a real app, this would request notification permissions
        Alert.alert(
            'Permission Request',
            'This would request notification permissions from the device. In this demo, we\'ll assume permissions are granted.',
            [{ text: 'OK' }]
        );
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Notifications' }} />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Notification Settings</Text>
                        <Text style={styles.subtitle}>
                            Customize how and when you receive notifications from BioAge Calculator.
                        </Text>
                    </View>

                    <Card variant="elevated" style={styles.masterToggleCard}>
                        <View style={styles.masterToggleContainer}>
                            <View style={styles.masterToggleLeft}>
                                {masterToggle ? (
                                    <Bell size={24} color={Colors.primary} />
                                ) : (
                                    <BellOff size={24} color={Colors.textLight} />
                                )}
                                <View style={styles.masterToggleTextContainer}>
                                    <Text style={styles.masterToggleTitle}>
                                        {masterToggle ? 'Notifications Enabled' : 'Notifications Disabled'}
                                    </Text>
                                    <Text style={styles.masterToggleDescription}>
                                        {masterToggle
                                            ? 'You will receive notifications based on your preferences'
                                            : 'You will not receive any notifications from the app'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={masterToggle}
                                onValueChange={toggleAllNotifications}
                                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                                thumbColor={masterToggle ? Colors.primary : '#f4f3f4'}
                            />
                        </View>
                    </Card>

                    {Platform.OS !== 'web' && (
                        <Button
                            title="Request Notification Permissions"
                            onPress={requestPermissions}
                            variant="outline"
                            fullWidth
                            style={styles.permissionButton}
                        />
                    )}

                    <Text style={styles.sectionTitle}>Notification Preferences</Text>

                    {notificationSettings.map(setting => (
                        <Card key={setting.id} style={styles.notificationCard}>
                            <View style={styles.notificationHeader}>
                                <View style={styles.iconContainer}>
                                    {setting.icon}
                                </View>
                                <View style={styles.notificationTextContainer}>
                                    <Text style={styles.notificationTitle}>{setting.title}</Text>
                                    <Text style={styles.notificationDescription}>{setting.description}</Text>
                                </View>
                                <Switch
                                    value={setting.enabled && masterToggle}
                                    onValueChange={() => toggleNotification(setting.id)}
                                    trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                                    thumbColor={setting.enabled && masterToggle ? Colors.primary : '#f4f3f4'}
                                    disabled={!masterToggle}
                                />
                            </View>

                            {setting.enabled && masterToggle && (
                                <View style={styles.notificationOptions}>
                                    {setting.time && (
                                        <View style={styles.optionItem}>
                                            <Clock size={16} color={Colors.textSecondary} />
                                            <Text style={styles.optionLabel}>Time:</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    // In a real app, this would open a time picker
                                                    Alert.alert(
                                                        'Set Time',
                                                        'This would open a time picker in a real app.',
                                                        [{ text: 'OK' }]
                                                    );
                                                }}
                                            >
                                                <Text style={styles.optionValue}>{setting.time}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {setting.frequency && (
                                        <View style={styles.optionItem}>
                                            <Calendar size={16} color={Colors.textSecondary} />
                                            <Text style={styles.optionLabel}>Frequency:</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    // In a real app, this would open a frequency picker
                                                    Alert.alert(
                                                        'Set Frequency',
                                                        'Choose notification frequency',
                                                        [
                                                            {
                                                                text: 'Daily',
                                                                onPress: () => handleFrequencyChange(setting.id, 'daily')
                                                            },
                                                            {
                                                                text: 'Weekly',
                                                                onPress: () => handleFrequencyChange(setting.id, 'weekly')
                                                            },
                                                            {
                                                                text: 'Monthly',
                                                                onPress: () => handleFrequencyChange(setting.id, 'monthly')
                                                            },
                                                            {
                                                                text: 'Cancel',
                                                                style: 'cancel'
                                                            }
                                                        ]
                                                    );
                                                }}
                                            >
                                                <Text style={styles.optionValue}>
                                                    {setting.frequency.charAt(0).toUpperCase() + setting.frequency.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </Card>
                    ))}

                    <View style={styles.disclaimer}>
                        <Text style={styles.disclaimerText}>
                            Note: This is a demo app. In a production environment, notifications would be delivered based on these settings.
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
    masterToggleCard: {
        marginBottom: 16,
        padding: 16,
    },
    masterToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    masterToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    masterToggleTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    masterToggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    masterToggleDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    permissionButton: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    notificationCard: {
        marginBottom: 12,
        padding: 16,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    notificationTextContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 4,
    },
    notificationDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    notificationOptions: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginLeft: 8,
        marginRight: 8,
    },
    optionValue: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
    disclaimer: {
        marginTop: 24,
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