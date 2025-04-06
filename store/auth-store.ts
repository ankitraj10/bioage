import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, User } from "@/types/user";

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    dateOfBirth: "1985-06-15",
    gender: "male",
    height: 175,
    weight: 70,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

const useAuthStore = create<
  AuthState & {
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => Promise<void>;
  }
>(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Find user (in a real app, this would be a server authentication)
          const user = MOCK_USERS.find((u) => u.email === email);

          if (!user) {
            throw new Error("Invalid credentials");
          }

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Check if user already exists
          if (MOCK_USERS.some((u) => u.email === email)) {
            throw new Error("User already exists");
          }

          // Create new user
          const newUser: User = {
            id: String(MOCK_USERS.length + 1),
            email,
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // In a real app, this would be saved to a database
          MOCK_USERS.push(newUser);

          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Signup failed",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });

        try {
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error("User not authenticated");
          }

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const updatedUser = {
            ...currentUser,
            ...userData,
            updatedAt: new Date().toISOString(),
          };

          // Update in mock data
          const userIndex = MOCK_USERS.findIndex(
            (u) => u.id === currentUser.id
          );
          if (userIndex >= 0) {
            MOCK_USERS[userIndex] = updatedUser;
          }

          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Profile update failed",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
