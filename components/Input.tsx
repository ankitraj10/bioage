import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    Platform
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
    disabled?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    error,
    disabled = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    style,
    inputStyle,
    multiline = false,
    numberOfLines = 1,
    maxLength,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputContainer,
                error ? styles.inputError : null,
                disabled ? styles.inputDisabled : null
            ]}>
                <TextInput
                    style={[
                        styles.input,
                        multiline ? styles.multilineInput : null,
                        inputStyle
                    ]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    editable={!disabled}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    numberOfLines={Platform.OS === 'ios' ? undefined : numberOfLines}
                    maxLength={maxLength}
                    placeholderTextColor={Colors.textLight}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                        activeOpacity={0.7}
                    >
                        {isPasswordVisible ? (
                            <EyeOff size={20} color={Colors.textSecondary} />
                        ) : (
                            <Eye size={20} color={Colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
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
        marginBottom: 6,
        color: Colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: Colors.error,
    },
    inputDisabled: {
        backgroundColor: Colors.card,
        borderColor: Colors.border,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginTop: 4,
    },
    eyeIcon: {
        padding: 10,
    },
});

export default Input;