import React from "react";
import { Tabs } from "expo-router";
import {
    Home,
    Calculator,
    Activity,
    User
} from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textLight,
                tabBarStyle: {
                    borderTopColor: Colors.border,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: Colors.background,
                },
                headerTitleStyle: {
                    fontWeight: '600',
                },
                headerShadowVisible: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <Home size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calculator"
                options={{
                    title: "Calculate",
                    tabBarIcon: ({ color, size }) => (
                        <Calculator size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="recommendations"
                options={{
                    title: "Insights",
                    tabBarIcon: ({ color, size }) => (
                        <Activity size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <User size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}