export interface User {
  id: string;
  email: string;
  name?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";

  createdAt: string;
  updatedAt: string;
  age: number;
  profile: {
    height?: number; // in cm
    weight?: number; // in kg
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
