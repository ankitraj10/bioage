import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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

        return isValid;
    };

    const handleResetPassword = async () => {
        if (validateForm()) {
            setIsLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsLoading(false);
            setIsSubmitted(true);
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
                    {!isSubmitted ? (
                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Reset Password</Text>
                            <Text style={styles.subtitle}>
                                Enter your email address and we'll send you instructions to reset your password
                            </Text>

                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={emailError}
                            />

                            <Button
                                title="Send Reset Link"
                                onPress={handleResetPassword}
                                variant="primary"
                                size="large"
                                loading={isLoading}
                                disabled={isLoading}
                                fullWidth
                                style={styles.resetButton}
                            />
                        </View>
                    ) : (
                        <View style={styles.successContainer}>
                            <Text style={styles.title}>Check Your Email</Text>
                            <Text style={styles.subtitle}>
                                We've sent password reset instructions to {email}
                            </Text>

                            <Button
                                title="Back to Login"
                                onPress={() => router.push('/login')}
                                variant="primary"
                                size="large"
                                fullWidth
                                style={styles.backButton}
                            />
                        </View>
                    )}

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Remember your password?</Text>
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
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    resetButton: {
        marginTop: 8,
    },
    backButton: {
        marginTop: 24,
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