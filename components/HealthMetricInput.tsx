import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from './Input';
import Colors from '@/constants/colors';

interface HealthMetricInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    unit?: string;
    normalRange?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    error?: string;
}

const HealthMetricInput: React.FC<HealthMetricInputProps> = ({
    label,
    value,
    onChangeText,
    unit,
    normalRange,
    keyboardType = 'numeric',
    error,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
                {normalRange && (
                    <Text style={styles.normalRange}>Normal: {normalRange}</Text>
                )}
            </View>

            <View style={styles.inputRow}>
                <Input
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    error={error}
                    style={styles.input}
                />

                {unit && (
                    <View style={styles.unitContainer}>
                        <Text style={styles.unitText}>{unit}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    normalRange: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        marginBottom: 0,
    },
    unitContainer: {
        marginLeft: 8,
        paddingHorizontal: 12,
        height: 48,
        justifyContent: 'center',
        backgroundColor: Colors.card,
        borderRadius: 8,
    },
    unitText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
});

export default HealthMetricInput;