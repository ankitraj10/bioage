import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorBoundary } from "./error-boundary";
import Colors from "@/constants/colors";
import useAuthStore from "@/store/auth-store";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "onboarding",
};


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        ...FontAwesome.font,
    });
    const [initialRoute, setInitialRoute] = useState<string | null>(null);
    const { isAuthenticated } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (error) {
            console.error(error);
            throw error;
        }
    }, [loaded]);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
                setInitialRoute(hasCompletedOnboarding === 'true' ? '(auth)' : 'onboarding');
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                setInitialRoute('onboarding');
            }
        };

        checkOnboardingStatus();
    }, []);

    useEffect(() => {
        if (loaded && initialRoute) {
            SplashScreen.hideAsync();
        }
    }, [loaded, initialRoute]);

    // Handle authentication navigation
    // useEffect(() => {
    //     if (!loaded || !initialRoute) return;

    //     const inAuthGroup = segments[0] === '(auth)';
    //     const inTabsGroup = segments[0] === '(tabs)';
    //     const inOnboarding = segments[0] === 'onboarding';

    //     if (isAuthenticated && (inAuthGroup || inOnboarding)) {
    //         // Redirect authenticated users to tabs
    //         router.replace('/(tabs)');
    //     } else if (!isAuthenticated && inTabsGroup) {
    //         // Redirect unauthenticated users to auth
    //         router.replace('/(auth)');
    //     }
    // }, [isAuthenticated, segments, loaded, initialRoute]);

    if (!loaded || !initialRoute) {
        return null;
    }

    return (
        <ErrorBoundary>
            <RootLayoutNav initialRoute={initialRoute} />
        </ErrorBoundary>
    );
}

function RootLayoutNav({ initialRoute }: { initialRoute: string }) {
    return (
        <Stack
            initialRouteName={initialRoute}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.background,
                },
                headerTintColor: Colors.text,
                headerTitleStyle: {
                    fontWeight: '600',
                },
                contentStyle: {
                    backgroundColor: Colors.background,
                },
            }}
        >
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="modal"
                options={{
                    presentation: "modal",
                    title: "About Bio Age",
                }}
            />
            <Stack.Screen
                name="export-data"
                options={{
                    title: "Export Data",
                }}
            />
            <Stack.Screen
                name="notifications"
                options={{
                    title: "Notifications",
                }}
            />
            <Stack.Screen
                name="trends"
                options={{
                    title: "Trends & Analysis",
                }}
            />
            <Stack.Screen
                name="history"
                options={{
                    title: "Bio Age History",
                }}
            />
            <Stack.Screen
                name="result-details"
                options={{
                    title: "Assessment Details",
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    title: "Settings",
                }}
            />
            <Stack.Screen
                name="privacy"
                options={{
                    title: "Privacy & Data",
                }}
            />
        </Stack>
    );
}