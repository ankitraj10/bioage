import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Moon, Globe, Lock } from 'lucide-react-native';
import Card from '@/components/Card';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

    const toggleNotifications = () => {
        setNotifications(previous => !previous);
    };

    const toggleDarkMode = () => {
        // In a real app, this would update the app's theme
        setDarkMode(previous => !previous);
        Alert.alert(
            'Feature Not Available',
            'Dark mode is not implemented in this demo version.',
            [{ text: 'OK' }]
        );
    };

    const toggleUnits = () => {
        setUnits(previous => previous === 'metric' ? 'imperial' : 'metric');
        Alert.alert(
            'Feature Not Available',
            'Unit switching is not implemented in this demo version.',
            [{ text: 'OK' }]
        );
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Settings' }} />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>App Preferences</Text>

                    <Card style={styles.settingsCard}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: Colors.primaryLight }]}>
                                    <Bell size={20} color="#fff" />
                                </View>
                                <View>
                                    <Text style={styles.settingTitle}>Notifications</Text>
                                    <Text style={styles.settingDescription}>
                                        Receive reminders and updates
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={toggleNotifications}
                                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                                thumbColor={notifications ? Colors.primary : '#f4f3f4'}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: Colors.secondaryLight }]}>
                                    <Moon size={20} color="#fff" />
                                </View>
                                <View>
                                    <Text style={styles.settingTitle}>Dark Mode</Text>
                                    <Text style={styles.settingDescription}>
                                        Switch between light and dark themes
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={darkMode}
                                onValueChange={toggleDarkMode}
                                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                                thumbColor={darkMode ? Colors.primary : '#f4f3f4'}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: Colors.chart.chronoAge }]}>
                                    <Globe size={20} color="#fff" />
                                </View>
                                <View>
                                    <Text style={styles.settingTitle}>Units</Text>
                                    <Text style={styles.settingDescription}>
                                        {units === 'metric' ? 'Metric (cm, kg)' : 'Imperial (in, lb)'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.unitToggle}
                                onPress={toggleUnits}
                            >
                                <Text style={styles.unitToggleText}>
                                    {units === 'metric' ? 'Switch to Imperial' : 'Switch to Metric'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Card>

                    <Text style={styles.sectionTitle}>About</Text>

                    <Card style={styles.aboutCard}>
                        <View style={styles.aboutItem}>
                            <Text style={styles.aboutLabel}>Version</Text>
                            <Text style={styles.aboutValue}>1.0.0</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.aboutItem}>
                            <Text style={styles.aboutLabel}>Terms of Service</Text>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>View</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.aboutItem}>
                            <Text style={styles.aboutLabel}>Privacy Policy</Text>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>View</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.aboutItem}>
                            <Text style={styles.aboutLabel}>Contact Support</Text>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Email</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>

                    <View style={styles.disclaimer}>
                        <Lock size={14} color={Colors.textLight} />
                        <Text style={styles.disclaimerText}>
                            Your data is stored locally on your device. This app is for educational purposes only and should not replace medical advice.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
        marginLeft: 4,
    },
    settingsCard: {
        marginBottom: 24,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 4,
    },
    unitToggle: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: Colors.card,
        borderRadius: 16,
    },
    unitToggleText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '500',
    },
    aboutCard: {
        marginBottom: 24,
    },
    aboutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    aboutLabel: {
        fontSize: 16,
        color: Colors.text,
    },
    aboutValue: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    linkText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
    disclaimer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        backgroundColor: Colors.card,
        borderRadius: 8,
    },
    disclaimerText: {
        fontSize: 12,
        color: Colors.textLight,
        marginLeft: 8,
        flex: 1,
        lineHeight: 18,
    },
});