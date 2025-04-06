import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import useAuthStore from '@/store/auth-store';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const { signup, isLoading, error, isAuthenticated } = useAuthStore();

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         router.replace('/(tabs)');
    //     }
    // }, [isAuthenticated]);

    const validateForm = () => {
        let isValid = true;

        // Validate name
        if (!name) {
            setNameError('Name is required');
            isValid = false;
        } else {
            setNameError('');
        }

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

        // Validate confirm password
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        return isValid;
    };

    const handleSignup = async () => {
        if (validateForm()) {
            await signup(email, password, name);
        }
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to start tracking your biological age</Text>

                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            error={nameError}
                        />

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
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={passwordError}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            error={confirmPasswordError}
                        />

                        <Button
                            title="Create Account"
                            onPress={handleSignup}
                            variant="primary"
                            size="large"
                            loading={isLoading}
                            disabled={isLoading}
                            fullWidth
                            style={styles.signupButton}
                        />
                    </View>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginLink}>Log In</Text>
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
    signupButton: {
        marginTop: 8,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    loginText: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginRight: 4,
    },
    loginLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});