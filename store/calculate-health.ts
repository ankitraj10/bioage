import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenAI } from "openai";
import {
  BloodWorkData,
  LifestyleData,
  VitalData,
  BioAgeResult,
  Recommendation,
} from "@/types/health";

const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

interface CalculateHealthState {
  bloodwork: BloodWorkData | null;
  lifestyle: LifestyleData | null;
  vitals: VitalData | null;
  isLoading: boolean;
  error: string | null;
  results: BioAgeResult[];
  setBloodwork: (data: BloodWorkData) => void;
  setLifestyle: (data: LifestyleData) => void;
  setVitals: (data: VitalData) => void;
  calculateWithAI: (
    chronologicalAge: number,
    userId: string
  ) => Promise<BioAgeResult | null>;
  clearResult: () => void;
  clearHealthData: () => void;
}

const useCalculateHealthStore = create<CalculateHealthState>()(
  persist(
    (set, get) => ({
      bloodwork: null,
      lifestyle: null,
      vitals: null,
      isLoading: false,
      error: null,
      results: [],

      setBloodwork: (data) => set({ bloodwork: data }),
      setLifestyle: (data) => set({ lifestyle: data }),
      setVitals: (data) => set({ vitals: data }),

      calculateWithAI: async (chronologicalAge, userId) => {
        set({ isLoading: true, error: null });
        const { bloodwork, lifestyle, vitals, results } = get();

        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a health AI assistant that calculates a user's biological age and provides personalized health recommendations. Return a JSON object with: bioAge (number), bloodworkScore (0-1), lifestyleScore (0-1), vitalScore (0-1), overallHealth (Poor | Fair | Good | Excellent), and recommendations (array of objects with id, category, title, description, priority, impact).",
              },
              {
                role: "user",
                content: `Calculate biological age and generate recommendations for a person with:\nChronological Age: ${chronologicalAge}\nBloodwork: ${JSON.stringify(
                  bloodwork
                )}\nLifestyle: ${JSON.stringify(
                  lifestyle
                )}\nVitals: ${JSON.stringify(
                  vitals
                )}\nReturn JSON with bioAge, bloodworkScore, lifestyleScore, vitalScore, overallHealth, and recommendations.`,
              },
            ],
            temperature: 0.3,
          });

          const raw = response.choices[0].message?.content || "";
          const parsed = JSON.parse(raw);

          const newResult: BioAgeResult = {
            id: Date.now().toString(),
            userId,
            date: new Date().toISOString(),
            chronologicalAge,
            biologicalAge: parsed.bioAge || chronologicalAge,
            bloodworkScore: parsed.bloodworkScore || 0.5,
            lifestyleScore: parsed.lifestyleScore || 0.5,
            vitalScore: parsed.vitalScore || 0.5,
            overallHealth: parsed.overallHealth || "Fair",
            recommendations: parsed.recommendations || [],
          };

          set({ results: [newResult, ...results], isLoading: false });
          return newResult;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Calculation failed",
            isLoading: false,
          });
          return null;
        }
      },

      clearResult: () => {
        set({ results: [] });
        console.log("bilogical result cleared");
      },

      clearHealthData: () => {
        set({
          bloodwork: null,
          lifestyle: null,
          vitals: null,
          results: [],
        });
      },
    }),
    {
      name: "calculate-health-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCalculateHealthStore;
