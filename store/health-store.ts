import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HealthState,
  BloodWorkData,
  LifestyleData,
  VitalData,
  BioAgeResult,
  Recommendation,
} from "@/types/health";
import {
  bloodWorkMetrics,
  lifestyleMetrics,
  vitalMetrics,
} from "@/constants/metrics";
import useAuthStore from "./auth-store";

// Mock recommendations based on health data
const generateRecommendations = (
  bloodwork: BloodWorkData | null,
  lifestyle: LifestyleData | null,
  vitals: VitalData | null
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Add some default recommendations
  recommendations.push({
    id: "1",
    category: "Exercise",
    title: "Increase physical activity",
    description:
      "Aim for at least 150 minutes of moderate exercise per week to improve cardiovascular health.",
    priority: "Medium",
    impact: 1.2,
  });

  // Add conditional recommendations based on data
  if (bloodwork?.glucose && bloodwork.glucose > 100) {
    recommendations.push({
      id: "2",
      category: "Nutrition",
      title: "Reduce sugar intake",
      description:
        "Your glucose levels are elevated. Consider reducing refined carbohydrates and added sugars in your diet.",
      priority: "High",
      impact: 1.5,
    });
  }

  if (lifestyle?.sleepHours && lifestyle.sleepHours < 7) {
    recommendations.push({
      id: "3",
      category: "Lifestyle",
      title: "Improve sleep quality",
      description:
        "You're getting less than the recommended 7-9 hours of sleep. Establish a regular sleep schedule and create a restful environment.",
      priority: "High",
      impact: 1.8,
    });
  }

  if (vitals?.systolicBP && vitals.systolicBP > 120) {
    recommendations.push({
      id: "4",
      category: "Medical",
      title: "Monitor blood pressure",
      description:
        "Your blood pressure is slightly elevated. Consider regular monitoring and consult with a healthcare provider.",
      priority: "Medium",
      impact: 1.0,
    });
  }

  // Add more general recommendations
  recommendations.push({
    id: "5",
    category: "Nutrition",
    title: "Increase plant-based foods",
    description:
      "Aim to fill half your plate with vegetables and fruits at each meal to increase nutrient intake.",
    priority: "Medium",
    impact: 0.8,
  });

  recommendations.push({
    id: "6",
    category: "Lifestyle",
    title: "Practice stress management",
    description:
      "Incorporate stress-reduction techniques like meditation, deep breathing, or yoga into your daily routine.",
    priority: "Medium",
    impact: 0.9,
  });

  return recommendations;
};

// Calculate biological age based on health metrics
const calculateBioAge = (
  chronologicalAge: number,
  bloodwork: BloodWorkData | null,
  lifestyle: LifestyleData | null,
  vitals: VitalData | null
): {
  bioAge: number;
  bloodworkScore: number;
  lifestyleScore: number;
  vitalScore: number;
  overallHealth: "Poor" | "Fair" | "Good" | "Excellent";
} => {
  // Default scores
  let bloodworkScore = 0.5;
  let lifestyleScore = 0.5;
  let vitalScore = 0.5;

  // Calculate bloodwork score if data exists
  if (bloodwork) {
    let totalWeight = 0;
    let weightedScore = 0;

    bloodWorkMetrics.forEach((metric) => {
      const value = bloodwork[metric.id as keyof BloodWorkData] as
        | number
        | undefined;
      if (value !== undefined) {
        // Simple scoring logic (in a real app, this would be more sophisticated)
        const normalRangeParts = metric.normalRange
          .replace(/[<>]/g, "")
          .split("-");
        let score = 0.5; // Default middle score

        if (normalRangeParts.length === 2) {
          const [min, max] = normalRangeParts.map(Number);
          if (value >= min && value <= max) {
            score = 0.8; // Within normal range
          } else if (value < min) {
            score = 0.3; // Below normal range
          } else {
            score = 0.2; // Above normal range
          }
        } else if (metric.normalRange.startsWith("<")) {
          const max = Number(normalRangeParts[0]);
          score = value <= max ? 0.8 : 0.2;
        }

        weightedScore += score * metric.weight;
        totalWeight += metric.weight;
      }
    });

    bloodworkScore = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
  }

  // Calculate lifestyle score if data exists
  if (lifestyle) {
    let totalWeight = 0;
    let weightedScore = 0;

    lifestyleMetrics.forEach((metric) => {
      const value = lifestyle[metric.id as keyof LifestyleData];
      if (value !== undefined) {
        let score = 0.5;

        if (metric.id === "sleepHours") {
          const hours = value as number;
          if (hours >= 7 && hours <= 9) score = 0.9;
          else if (hours >= 6 && hours < 7) score = 0.6;
          else score = 0.3;
        } else if (metric.id === "exerciseMinutes") {
          const minutes = value as number;
          if (minutes >= 150) score = 0.9;
          else if (minutes >= 75) score = 0.6;
          else score = 0.3;
        } else if (metric.id === "alcoholDrinks") {
          const drinks = value as number;
          if (drinks <= 7) score = 0.8;
          else if (drinks <= 14) score = 0.5;
          else score = 0.2;
        } else if (metric.id === "smokingStatus") {
          const status = value as string;
          if (status === "Never") score = 0.9;
          else if (status === "Former") score = 0.6;
          else score = 0.2;
        } else if (metric.id === "stressLevel") {
          const level = value as string;
          if (level === "Low") score = 0.9;
          else if (level === "Moderate") score = 0.6;
          else score = 0.3;
        } else if (metric.id === "dietQuality") {
          const quality = value as string;
          if (quality === "Excellent") score = 0.9;
          else if (quality === "Good") score = 0.7;
          else if (quality === "Average") score = 0.5;
          else score = 0.2;
        }

        weightedScore += score * metric.weight;
        totalWeight += metric.weight;
      }
    });

    lifestyleScore = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
  }

  // Calculate vital signs score if data exists
  if (vitals) {
    let totalWeight = 0;
    let weightedScore = 0;

    vitalMetrics.forEach((metric) => {
      const value = vitals[metric.id as keyof VitalData] as number | undefined;
      if (value !== undefined) {
        let score = 0.5;

        const normalRangeParts = metric.normalRange.split("-");
        const [min, max] = normalRangeParts.map(Number);

        if (value >= min && value <= max) {
          score = 0.8;
        } else if (value < min) {
          score = 0.4;
        } else {
          score = 0.3;
        }

        weightedScore += score * metric.weight;
        totalWeight += metric.weight;
      }
    });

    vitalScore = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
  }

  // Calculate overall score
  const overallScore =
    bloodworkScore * 0.4 + lifestyleScore * 0.35 + vitalScore * 0.25;

  // Determine overall health category
  let overallHealth: "Poor" | "Fair" | "Good" | "Excellent";
  if (overallScore >= 0.8) overallHealth = "Excellent";
  else if (overallScore >= 0.6) overallHealth = "Good";
  else if (overallScore >= 0.4) overallHealth = "Fair";
  else overallHealth = "Poor";

  // Calculate biological age adjustment
  // Better health = younger bio age, worse health = older bio age
  const ageDifference = (0.5 - overallScore) * 20; // Range: -10 to +10 years
  const bioAge = chronologicalAge + ageDifference;

  return {
    bioAge: Math.max(Math.round(bioAge * 10) / 10, 18), // Round to 1 decimal, minimum 18
    bloodworkScore: Math.round(bloodworkScore * 100) / 100,
    lifestyleScore: Math.round(lifestyleScore * 100) / 100,
    vitalScore: Math.round(vitalScore * 100) / 100,
    overallHealth,
  };
};

const useHealthStore = create<
  HealthState & {
    setBloodwork: (data: BloodWorkData) => void;
    setLifestyle: (data: LifestyleData) => void;
    setVitals: (data: VitalData) => void;
    calculateBioAge: () => Promise<BioAgeResult | null>;
    clearHealthData: () => void;
  }
>(
  persist(
    (set, get) => ({
      bloodwork: null,
      lifestyle: null,
      vitals: null,
      bioAgeResults: [],
      isLoading: false,
      error: null,

      setBloodwork: (data: BloodWorkData) => {
        set({ bloodwork: data });
      },

      setLifestyle: (data: LifestyleData) => {
        set({ lifestyle: data });
      },

      setVitals: (data: VitalData) => {
        set({ vitals: data });
      },

      calculateBioAge: async () => {
        set({ isLoading: true, error: null });

        try {
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error("User not authenticated");
          }

          const { bloodwork, lifestyle, vitals } = get();

          // Calculate chronological age
          let chronologicalAge = 30; // Default age if not provided
          if (user.dateOfBirth) {
            const birthDate = new Date(user.dateOfBirth);
            const today = new Date();
            chronologicalAge = today.getFullYear() - birthDate.getFullYear();

            // Adjust age if birthday hasn't occurred yet this year
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              chronologicalAge--;
            }
          }

          // Calculate biological age
          const {
            bioAge,
            bloodworkScore,
            lifestyleScore,
            vitalScore,
            overallHealth,
          } = calculateBioAge(chronologicalAge, bloodwork, lifestyle, vitals);

          // Generate recommendations
          const recommendations = generateRecommendations(
            bloodwork,
            lifestyle,
            vitals
          );

          // Create result object
          const result: BioAgeResult = {
            id: Date.now().toString(),
            userId: user.id,
            date: new Date().toISOString(),
            chronologicalAge,
            biologicalAge: bioAge,
            bloodworkScore,
            lifestyleScore,
            vitalScore,
            overallHealth,
            recommendations,
          };

          // Update state with new result
          set((state) => ({
            bioAgeResults: [result, ...state.bioAgeResults],
            isLoading: false,
          }));

          return result;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Calculation failed",
            isLoading: false,
          });
          return null;
        }
      },

      clearHealthData: () => {
        set({
          bloodwork: null,
          lifestyle: null,
          vitals: null,
          bioAgeResults: [],
        });
      },
    }),
    {
      name: "health-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useHealthStore;
