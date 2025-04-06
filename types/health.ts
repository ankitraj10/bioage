export interface BloodWorkData {
  id: string;
  userId: string;
  date: string;
  glucose?: number;
  totalCholesterol?: number;
  hdl?: number;
  ldl?: number;
  triglycerides?: number;
  creatinine?: number;
  bun?: number;
  alt?: number;
  ast?: number;
  hba1c?: number;
  vitaminD?: number;
  tsh?: number;
}

export interface LifestyleData {
  id: string;
  userId: string;
  date: string;
  sleepHours?: number;
  exerciseMinutes?: number;
  alcoholDrinks?: number;
  smokingStatus?: "Never" | "Former" | "Current";
  stressLevel?: "Low" | "Moderate" | "High";
  dietQuality?: "Poor" | "Average" | "Good" | "Excellent";
}

export interface VitalData {
  id: string;
  userId: string;
  date: string;
  systolicBP?: number;
  diastolicBP?: number;
  restingHR?: number;
  bmi?: number;
}

export interface BioAgeResult {
  id: string;
  userId: string;
  date: string;
  chronologicalAge: number;
  biologicalAge: number;
  bloodworkScore: number;
  lifestyleScore: number;
  vitalScore: number;
  overallHealth: "Poor" | "Fair" | "Good" | "Excellent";
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  category: "Lifestyle" | "Nutrition" | "Medical" | "Exercise";
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  impact: number; // Estimated impact on biological age (in years)
}

export interface HealthState {
  bloodwork: BloodWorkData | null;
  lifestyle: LifestyleData | null;
  vitals: VitalData | null;
  bioAgeResults: BioAgeResult[];
  isLoading: boolean;
  error: string | null;
}
