export interface User {
  id: string;
  email: string;
  name?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  height?: number; // in cm
  weight?: number; // in kg
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
