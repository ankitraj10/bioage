import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Colors from '@/constants/colors';

interface CardProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'default'
}) => {
    const getCardStyle = () => {
        let cardStyle: StyleProp<ViewStyle> = [styles.card];

        switch (variant) {
            case 'elevated':
                cardStyle = [...cardStyle, styles.cardElevated];
                break;
            case 'outlined':
                cardStyle = [...cardStyle, styles.cardOutlined];
                break;
            default:
                cardStyle = [...cardStyle, styles.cardDefault];
        }

        return cardStyle;
    };

    return (
        <View style={[getCardStyle(), style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
    },
    cardDefault: {
        backgroundColor: Colors.card,
    },
    cardElevated: {
        backgroundColor: Colors.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardOutlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.border,
    },
});

export default Card;