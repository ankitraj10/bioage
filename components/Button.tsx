import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    StyleProp,
    ViewStyle,
    TextStyle,
    View
} from 'react-native';
import Colors from '@/constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    fullWidth = false,
    icon,
    iconPosition = 'left',
}) => {
    const getButtonStyle = () => {
        let buttonStyle: StyleProp<ViewStyle> = [styles.button];

        // Add size styles
        switch (size) {
            case 'small':
                buttonStyle = [...buttonStyle, styles.buttonSmall];
                break;
            case 'large':
                buttonStyle = [...buttonStyle, styles.buttonLarge];
                break;
            default:
                buttonStyle = [...buttonStyle, styles.buttonMedium];
        }

        // Add variant styles
        switch (variant) {
            case 'secondary':
                buttonStyle = [...buttonStyle, styles.buttonSecondary];
                break;
            case 'outline':
                buttonStyle = [...buttonStyle, styles.buttonOutline];
                break;
            case 'text':
                buttonStyle = [...buttonStyle, styles.buttonText];
                break;
            default:
                buttonStyle = [...buttonStyle, styles.buttonPrimary];
        }

        // Add disabled style
        if (disabled) {
            buttonStyle = [...buttonStyle, styles.buttonDisabled];
        }

        // Add full width style
        if (fullWidth) {
            buttonStyle = [...buttonStyle, styles.buttonFullWidth];
        }

        return buttonStyle;
    };

    const getTextStyle = () => {
        let textStyleArray: StyleProp<TextStyle> = [styles.buttonLabel];

        // Add size styles
        switch (size) {
            case 'small':
                textStyleArray = [...textStyleArray, styles.buttonLabelSmall];
                break;
            case 'large':
                textStyleArray = [...textStyleArray, styles.buttonLabelLarge];
                break;
            default:
                textStyleArray = [...textStyleArray, styles.buttonLabelMedium];
        }

        // Add variant styles
        switch (variant) {
            case 'secondary':
                textStyleArray = [...textStyleArray, styles.buttonLabelSecondary];
                break;
            case 'outline':
                textStyleArray = [...textStyleArray, styles.buttonLabelOutline];
                break;
            case 'text':
                textStyleArray = [...textStyleArray, styles.buttonLabelText];
                break;
            default:
                textStyleArray = [...textStyleArray, styles.buttonLabelPrimary];
        }

        // Add disabled style
        if (disabled) {
            textStyleArray = [...textStyleArray, styles.buttonLabelDisabled];
        }

        return textStyleArray;
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' || variant === 'secondary' ? '#fff' : Colors.primary}
                />
            ) : (
                <View style={styles.contentContainer}>
                    {icon && iconPosition === 'left' && (
                        <View style={styles.iconLeft}>{icon}</View>
                    )}
                    <Text style={[getTextStyle(), textStyle]}>{title}</Text>
                    {icon && iconPosition === 'right' && (
                        <View style={styles.iconRight}>{icon}</View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSmall: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    buttonMedium: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    buttonLarge: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    buttonPrimary: {
        backgroundColor: Colors.primary,
    },
    buttonSecondary: {
        backgroundColor: Colors.secondary,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    buttonText: {
        backgroundColor: 'transparent',
    },
    buttonDisabled: {
        backgroundColor: Colors.textLight,
        borderColor: Colors.textLight,
    },
    buttonFullWidth: {
        width: '100%',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    buttonLabel: {
        fontWeight: '600',
    },
    buttonLabelSmall: {
        fontSize: 14,
    },
    buttonLabelMedium: {
        fontSize: 16,
    },
    buttonLabelLarge: {
        fontSize: 18,
    },
    buttonLabelPrimary: {
        color: '#fff',
    },
    buttonLabelSecondary: {
        color: '#fff',
    },
    buttonLabelOutline: {
        color: Colors.primary,
    },
    buttonLabelText: {
        color: Colors.primary,
    },
    buttonLabelDisabled: {
        color: '#fff',
    },
});

export default Button;