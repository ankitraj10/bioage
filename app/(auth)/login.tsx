import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import useAuthStore from '@/store/auth-store';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { login, isLoading, error, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated]);

    const validateForm = () => {
        let isValid = true;

        // Validate email
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Validate password
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (validateForm()) {
            await login(email, password);
        }
    };

    // For demo purposes, pre-fill with demo account
    const fillDemoAccount = () => {
        setEmail('demo@example.com');
        setPassword('password');
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Log in to your account to continue</Text>

                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={emailError}
                        />

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={passwordError}
                        />

                        <TouchableOpacity
                            onPress={() => router.push('/forgot-password')}
                            style={styles.forgotPasswordLink}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Log In"
                            onPress={handleLogin}
                            variant="primary"
                            size="large"
                            loading={isLoading}
                            disabled={isLoading}
                            fullWidth
                            style={styles.loginButton}
                        />

                        <TouchableOpacity
                            onPress={fillDemoAccount}
                            style={styles.demoAccountLink}
                        >
                            <Text style={styles.demoAccountText}>Use demo account</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/signup')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 32,
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: Colors.error,
        fontSize: 14,
    },
    forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontSize: 14,
    },
    loginButton: {
        marginBottom: 16,
    },
    demoAccountLink: {
        alignSelf: 'center',
        marginTop: 8,
    },
    demoAccountText: {
        color: Colors.primary,
        fontSize: 14,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    signupText: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginRight: 4,
    },
    signupLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});