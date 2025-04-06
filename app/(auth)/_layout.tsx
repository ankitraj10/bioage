import { Stack } from "expo-router";
import Colors from "@/constants/colors";

export default function AuthLayout() {
    return (
        <Stack
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
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="login"
                options={{
                    title: "Log In",
                }}
            />
            <Stack.Screen
                name="signup"
                options={{
                    title: "Sign Up",
                }}
            />
            <Stack.Screen
                name="forgot-password"
                options={{
                    title: "Reset Password",
                }}
            />
        </Stack>
    );
}