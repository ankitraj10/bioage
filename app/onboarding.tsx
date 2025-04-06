import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Discover Your True Age',
        description: 'Your chronological age is just a number. Learn how your body is really aging based on scientific biomarkers.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'Track Your Health Metrics',
        description: 'Input your health data from blood work, lifestyle habits, and vital signs to calculate your biological age.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'Get Personalized Insights',
        description: 'Receive tailored recommendations to improve your biological age and overall health.',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1470&auto=format&fit=crop'
    },
    {
        id: '4',
        title: 'Monitor Your Progress',
        description: 'Track changes in your biological age over time and see how lifestyle modifications impact your health.',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1480&auto=format&fit=crop'
    }
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = React.useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true
            });
        } else {
            completeOnboarding();
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            router.replace('/(auth)');
        } catch (error) {
            console.error('Error saving onboarding status:', error);
        }
    };

    const handleSkip = () => {
        completeOnboarding();
    };

    const renderItem = ({ item }: { item: typeof slides[0] }) => {
        return (
            <View style={styles.slide}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    const renderPagination = () => {
        return (
            <View style={styles.paginationContainer}>
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.activeDot
                            ]}
                        />
                    ))}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.skipContainer}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />

            {renderPagination()}

            <View style={styles.buttonContainer}>
                <Button
                    title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                    onPress={handleNext}
                    variant="primary"
                    size="large"
                    fullWidth
                    style={styles.button}
                    icon={currentIndex === slides.length - 1 ? undefined : <ArrowRight size={20} color="#fff" />}
                    iconPosition="right"
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
    skipContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
    },
    skipText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '500',
    },
    slide: {
        width,
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: 20,
        marginTop: 40,
        marginBottom: 40,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    dotsContainer: {
        flexDirection: 'row',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.border,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: Colors.primary,
        width: 20,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        marginTop: 'auto',
    },
    button: {
        marginBottom: 12,
    },
});