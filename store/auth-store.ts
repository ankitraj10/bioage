import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { AuthState, User } from "@/types/user";
import { StateCreator } from "zustand";

// Define extended store type
type AuthStore = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
};

// Zustand creator typed with persist middleware
const authStoreCreator: StateCreator<
  AuthStore,
  [["zustand/persist", unknown]],
  [],
  AuthStore
> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "",
        createdAt: firebaseUser.metadata.creationTime || "",
        updatedAt: firebaseUser.metadata.lastSignInTime || "",
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Login failed",
        isLoading: false,
      });
    }
  },

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      const user: User = {
        id: result.user.uid,
        email: result.user.email || "",
        name,
        createdAt: result.user.metadata.creationTime || "",
        updatedAt: result.user.metadata.lastSignInTime || "",
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Signup failed",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false });
    } catch (error: any) {
      set({ error: error.message || "Logout failed" });
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = get().user;
      if (!currentUser) throw new Error("User not authenticated");

      const updatedUser: User = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      if (auth.currentUser && userData.name) {
        await updateProfile(auth.currentUser, { displayName: userData.name });
      }

      set({ user: updatedUser, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Profile update failed",
        isLoading: false,
      });
    }
  },
});

// Create persisted store
const useAuthStore = create<AuthStore>()(
  persist(authStoreCreator, {
    name: "auth-storage",
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }),
  })
);

// Sync Firebase auth session on mount
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    useAuthStore.setState({
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "",
        createdAt: firebaseUser.metadata.creationTime || "",
        updatedAt: firebaseUser.metadata.lastSignInTime || "",
      },
      isAuthenticated: true,
    });
  } else {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
});

export default useAuthStore;
