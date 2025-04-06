import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import useAuthStore from '@/store/auth-store';

export default function WelcomeScreen() {
    const { isAuthenticated } = useAuthStore();

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         router.replace('/(tabs)');
    //     }
    // }, [isAuthenticated]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&auto=format&fit=crop' }}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>BioAge Calculator</Text>
                    <Text style={styles.subtitle}>
                        Discover your true biological age and get personalized health recommendations
                    </Text>
                </View>

                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Calculate your biological age</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Track health metrics over time</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Get personalized recommendations</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Improve your longevity</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Create Account"
                    onPress={() => router.push('/signup')}
                    variant="primary"
                    size="large"
                    fullWidth
                    style={styles.button}
                />
                <Button
                    title="Log In"
                    onPress={() => router.push('/login')}
                    variant="outline"
                    size="large"
                    fullWidth
                    style={styles.button}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    textContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    featuresContainer: {
        marginBottom: 32,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginRight: 12,
    },
    featureText: {
        fontSize: 16,
        color: Colors.text,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    },
    button: {
        marginBottom: 12,
    },
});