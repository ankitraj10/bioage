import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';

interface HealthMetricPickerProps {
    label: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

const HealthMetricPicker: React.FC<HealthMetricPickerProps> = ({
    label,
    options,
    selectedValue,
    onSelect,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.optionsContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.option,
                            selectedValue === option && styles.selectedOption
                        ]}
                        onPress={() => onSelect(option)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedValue === option && styles.selectedOptionText
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: Colors.text,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.card,
    },
    selectedOption: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    optionText: {
        fontSize: 14,
        color: Colors.text,
    },
    selectedOptionText: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default HealthMetricPicker;