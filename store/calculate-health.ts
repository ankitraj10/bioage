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
import { useEffect } from "react";

interface CalculateHealthState {
  bloodwork: BloodWorkData | null;
  lifestyle: LifestyleData | null;
  vitals: VitalData | null;
  isLoading: boolean;
  error: string | null;
  results: BioAgeResult[];
  history: [];
  setBloodwork: (data: BloodWorkData) => void;
  setLifestyle: (data: LifestyleData) => void;
  setVitals: (data: VitalData) => void;
  calculateWithAI: (
    chronologicalAge: number,
    userId: string
  ) => Promise<BioAgeResult | null>;
  clearResult: () => void;
  clearHealthData: () => void;
  uploadAndParsePdf: (fileUri: string) => Promise<boolean>;
  fetchHistory: (userId: string) => Promise<void>;
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
      history: [],

      setBloodwork: (data) => set({ bloodwork: data }),
      setLifestyle: (data) => set({ lifestyle: data }),
      setVitals: (data) => set({ vitals: data }),

      calculateWithAI: async (chronologicalAge, userId) => {
        console.log("bioage resultffff ----- 11", userId);
        set({ isLoading: true, error: null });
        const { bloodwork, lifestyle, vitals, results } = get();
        const token = await AsyncStorage.getItem("auth-token");
        // console.log("data record", bloodwork, lifestyle, vitals);
        try {
          const response = await fetch(
            "https://bioage.onrender.com/api/bioage/calculate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Replace this with your actual auth token logic
              },
              body: JSON.stringify({
                healthData: {
                  bloodwork,
                  lifestyle,
                  vitals,
                },
                notes: "Submitted from mobile app",
              }),
            }
          );

          // if (!response.ok) {
          //   throw new Error("Server error");
          // }

          const data = await response.json();
          console.log("bioage resultffff -----", data);

          const newResult: BioAgeResult = {
            id: data.result.recordId,
            userId,
            date: data.result.calculatedAt,
            chronologicalAge: data.result.chronologicalAge,
            biologicalAge: data.result.biologicalAge,
            bloodworkScore: data.result.bloodworkScore || 0.5,
            lifestyleScore: data.result.lifestyleScore || 0.5,
            vitalScore: data.result.vitalScore || 0.5,
            overallHealth: data.result.healthStatus || "Fair",
            recommendations: data.result.recommendations || [],
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
        // console.log("bilogical result cleared");
      },

      clearHealthData: () => {
        set({
          bloodwork: null,
          lifestyle: null,
          vitals: null,
          results: [],
        });
      },
      uploadAndParsePdf: async (fileUri: string) => {
        set({ isLoading: true, error: null });
        // console.log("pdf", fileUri);
        const token = await AsyncStorage.getItem("auth-token");

        try {
          const formData = new FormData();
          formData.append("bloodwork", {
            uri: fileUri,
            name: "health_report.pdf",
            type: "application/pdf",
          } as any); // Type workaround for React Native

          const response = await fetch(
            "https://bioage.onrender.com/api/upload/pdf",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                // 👇 Do NOT set Content-Type manually for multipart/form-data
              },
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("PDF upload failed");
          }

          const data = await response.json();

          // Extract structured data and save to state
          const { vitals, lifestyle, bloodwork } = data.extractedData || {};

          const prev = get();
          // console.log("uploaded data", data.extractedData);
          set({
            vitals: vitals ? { ...prev.vitals, ...vitals } : prev.vitals,
            lifestyle: lifestyle
              ? { ...prev.lifestyle, ...lifestyle }
              : prev.lifestyle,
            bloodwork: bloodwork
              ? { ...prev.bloodwork, ...bloodwork }
              : prev.bloodwork,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Upload failed",
            isLoading: false,
          });
          return false;
        }
      },
      fetchHistory: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const token = await AsyncStorage.getItem("auth-token");
          const response = await fetch(
            "https://bioage.onrender.com/api/bioage/history",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          console.log("user 123", data, token);
          const parsedResults = data.history.map((record: any) => {
            const rawRecs = record.recommendations || [];

            const recommendations = rawRecs.map((rec: any, index: number) => {
              // Fix object-like text (char-indexed)
              const isCharIndexed =
                rec &&
                typeof rec === "object" &&
                !Array.isArray(rec) &&
                Object.keys(rec).every((key) => /^\d+$/.test(key));

              if (isCharIndexed) {
                const text = Object.values(rec).join("");
                return {
                  id: `rec-${record.id}-${index}`,
                  category: "Lifestyle",
                  title: text,
                  description: text,
                  priority: "Medium",
                  impact: 0.5,
                };
              }

              return rec;
            });

            return {
              id: record.id,
              userId: userId, // Not returned in API
              date: record.calculatedAt,
              chronologicalAge: record.chronologicalAge,
              biologicalAge: record.biologicalAge,
              bloodworkScore: record.bloodworkScore || 0.5,
              lifestyleScore: record.lifestyleScore || 0.5,
              vitalScore: record.vitalScore || 0.5,
              overallHealth: record.healthStatus || "Fair",
              recommendations,
            };
          });

          console.log("bioage resultffff ----- 22", parsedResults);

          set({ history: parsedResults, isLoading: false });
          return parsedResults;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "History fetch failed",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "calculate-health-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCalculateHealthStore;
