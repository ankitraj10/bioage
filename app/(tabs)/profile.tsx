import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    LogOut,
    ChevronRight,
    User,
    Calendar,
    Ruler,
    Weight,
    History,
    Settings,
    Shield,
    Bell,
    Download,
    TrendingUp,
    Share2
} from 'lucide-react-native';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import useAuthStore from '@/store/auth-store';
import useHealthStore from '@/store/health-store';

export default function ProfileScreen() {
    const { user, updateProfile, logout, isLoading } = useAuthStore();
    const { clearHealthData, bioAgeResults } = useHealthStore();

    const [name, setName] = useState(user?.name || '');
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
    const [height, setHeight] = useState(user?.height?.toString() || '');
    const [weight, setWeight] = useState(user?.weight?.toString() || '');
    const [gender, setGender] = useState(user?.gender || 'male');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setDateOfBirth(user.dateOfBirth || '');
            setHeight(user.height?.toString() || '');
            setWeight(user.weight?.toString() || '');
            setGender(user.gender || 'male');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            await updateProfile({
                name,
                dateOfBirth,
                height: height ? parseFloat(height) : undefined,
                weight: weight ? parseFloat(weight) : undefined,
                gender: gender as 'male' | 'female' | 'other',
            });

            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        logout();
                        router.replace('/(auth)');
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear Health Data',
            'Are you sure you want to clear all your health data? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Clear Data',
                    onPress: () => {
                        clearHealthData();
                        Alert.alert('Success', 'All health data has been cleared');
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            return dateString;
        }
    };

    const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return null;

        try {
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return age;
        } catch (error) {
            return null;
        }
    };

    const renderProfileInfo = () => (
        <Card variant="elevated" style={styles.profileCard}>
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
                </View>

                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{name || 'User'}</Text>
                    <Text style={styles.profileEmail}>{user?.email}</Text>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditing(true)}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.profileDetails}>
                <View style={styles.detailItem}>
                    <View style={styles.detailIcon}>
                        <Calendar size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Date of Birth</Text>
                        <Text style={styles.detailValue}>
                            {dateOfBirth ? formatDate(dateOfBirth) : 'Not set'}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.detailIcon}>
                        <User size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Age</Text>
                        <Text style={styles.detailValue}>
                            {dateOfBirth ? `${calculateAge(dateOfBirth)} years` : 'Not set'}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.detailIcon}>
                        <Ruler size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Height</Text>
                        <Text style={styles.detailValue}>
                            {height ? `${height} cm` : 'Not set'}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.detailIcon}>
                        <Weight size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Weight</Text>
                        <Text style={styles.detailValue}>
                            {weight ? `${weight} kg` : 'Not set'}
                        </Text>
                    </View>
                </View>
            </View>
        </Card>
    );

    const renderProfileForm = () => (
        <Card variant="elevated" style={styles.profileCard}>
            <Text style={styles.formTitle}>Edit Profile</Text>

            <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />

            <Input
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
            />

            <View style={styles.genderContainer}>
                <Text style={styles.genderLabel}>Gender</Text>
                <View style={styles.genderOptions}>
                    <TouchableOpacity
                        style={[
                            styles.genderOption,
                            gender === 'male' && styles.genderOptionSelected
                        ]}
                        onPress={() => setGender('male')}
                    >
                        <Text
                            style={[
                                styles.genderOptionText,
                                gender === 'male' && styles.genderOptionTextSelected
                            ]}
                        >
                            Male
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.genderOption,
                            gender === 'female' && styles.genderOptionSelected
                        ]}
                        onPress={() => setGender('female')}
                    >
                        <Text
                            style={[
                                styles.genderOptionText,
                                gender === 'female' && styles.genderOptionTextSelected
                            ]}
                        >
                            Female
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.genderOption,
                            gender === 'other' && styles.genderOptionSelected
                        ]}
                        onPress={() => setGender('other')}
                    >
                        <Text
                            style={[
                                styles.genderOptionText,
                                gender === 'other' && styles.genderOptionTextSelected
                            ]}
                        >
                            Other
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Input
                label="Height (cm)"
                placeholder="Enter your height in cm"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />

            <Input
                label="Weight (kg)"
                placeholder="Enter your weight in kg"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />

            <View style={styles.formButtons}>
                <Button
                    title="Cancel"
                    onPress={() => setIsEditing(false)}
                    variant="outline"
                    style={styles.cancelButton}
                />
                <Button
                    title="Save"
                    onPress={handleSaveProfile}
                    variant="primary"
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.saveButton}
                />
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {isEditing ? renderProfileForm() : renderProfileInfo()}

                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>Health Data</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/history')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, { backgroundColor: Colors.primaryLight }]}>
                                <History size={20} color="#fff" />
                            </View>
                            <Text style={styles.menuItemText}>Bio Age History</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/trends')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, { backgroundColor: Colors.chart.chronoAge }]}>
                                <TrendingUp size={20} color="#fff" />
                            </View>
                            <Text style={styles.menuItemText}>Trends & Analysis</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/export-data')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, { backgroundColor: Colors.secondary }]}>
                                <Download size={20} color="#fff" />
                            </View>
                            <Text style={styles.menuItemText}>Export Data</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.textLight} />
                    </TouchableOpacity>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>App Settings</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/notifications')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, { backgroundColor: Colors.primaryLight }]}>
                                <Bell size={20} color="#fff" />
                            </View>
                            <Text style={styles.menuItemText}>Notifications</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/settings')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, { backgroundColor: Colors.secondaryLight }]}>
                                <Settings size={20} color="#fff" />
                            </View>
                            <Text style={styles.menuItemText}>Settings</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/privacy')}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, { backgroundColor: Colors.chart.chronoAge }]}>
                                <Shield size={20} color="#fff" />
                            </View>
                            <Text style={styles.menuItemText}>Privacy & Data</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            if (bioAgeResults.length === 0) {
                                Alert.alert('No Data', 'You need to complete at least one assessment before sharing results.');
                                return;
                            }

                            const latestResult = bioAgeResults[0];
                            const message = `My BioAge Results:\n\nBiological Age: ${latestResult.biologicalAge}\nChronological Age: ${latestResult.chronologicalAge}\nOverall Health: ${latestResult.overallHealth}\n\nAssessed on: ${new Date(latestResult.date).toLocaleDateString()}`;

                            if (Platform.OS === 'web') {
                                Alert.alert('Share Not Available', 'Sharing is not available on web. Please use the mobile app.');
                            } else {
                                import('react-native').then(({ Share }) => {
                                    Share.share({
                                        message,
                                        title: 'My BioAge Results',
                                    }).catch(error => {
                                        console.error('Error sharing results:', error);
                                    });
                                });
                            }
                        }}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, { backgroundColor: Colors.primary }]}>
                                <Share2 size={20} color="#fff" />
                            </View>
                            <Text style={styles.menuItemText}>Share Results</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.textLight} />
                    </TouchableOpacity>
                </View>

                <View style={styles.dangerSection}>
                    <TouchableOpacity
                        style={styles.dangerButton}
                        onPress={handleClearData}
                    >
                        <Text style={styles.dangerButtonText}>Clear Health Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <LogOut size={20} color={Colors.error} />
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsSection}>
                    <Text style={styles.statsSectionTitle}>Your Stats</Text>
                    <Card style={styles.statsCard}>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{bioAgeResults.length}</Text>
                                <Text style={styles.statLabel}>Assessments</Text>
                            </View>

                            <View style={styles.statDivider} />

                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {bioAgeResults.length > 0
                                        ? `${bioAgeResults[0].biologicalAge}`
                                        : '-'}
                                </Text>
                                <Text style={styles.statLabel}>Current Bio Age</Text>
                            </View>

                            <View style={styles.statDivider} />

                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {bioAgeResults.length > 1
                                        ? `${(bioAgeResults[0].biologicalAge - bioAgeResults[bioAgeResults.length - 1].biologicalAge).toFixed(1)}`
                                        : '-'}
                                </Text>
                                <Text style={styles.statLabel}>Change</Text>
                            </View>
                        </View>
                    </Card>
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
    profileCard: {
        padding: 20,
        marginBottom: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    editButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: Colors.card,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.primary,
    },
    profileDetails: {
        marginTop: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        color: Colors.text,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    genderContainer: {
        marginBottom: 16,
    },
    genderLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: Colors.text,
    },
    genderOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    genderOption: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    genderOptionSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    genderOptionText: {
        fontSize: 14,
        color: Colors.text,
    },
    genderOptionTextSelected: {
        color: '#fff',
        fontWeight: '500',
    },
    formButtons: {
        flexDirection: 'row',
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
    },
    saveButton: {
        flex: 1,
        marginLeft: 8,
    },
    menuSection: {
        marginBottom: 20,
    },
    menuSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.text,
    },
    dangerSection: {
        marginBottom: 20,
    },
    dangerButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.error,
        marginBottom: 12,
        alignItems: 'center',
    },
    dangerButtonText: {
        fontSize: 16,
        color: Colors.error,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    logoutButtonText: {
        fontSize: 16,
        color: Colors.error,
        fontWeight: '500',
        marginLeft: 8,
    },
    statsSection: {
        marginBottom: 20,
    },
    statsSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
        marginLeft: 4,
    },
    statsCard: {
        padding: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.border,
    },
});