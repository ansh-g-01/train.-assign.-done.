import clientPriya from "@/assets/client-priya.jpg";
import clientRohan from "@/assets/client-rohan.jpg";
import clientAnjali from "@/assets/client-anjali.jpg";
import clientVikram from "@/assets/client-vikram.jpg";
import exPushup from "@/assets/ex-pushup.jpg";
import exSquat from "@/assets/ex-squat.jpg";
import exPlank from "@/assets/ex-plank.jpg";
import exLunge from "@/assets/ex-lunge.jpg";
import exCurl from "@/assets/ex-curl.jpg";
import exPress from "@/assets/ex-press.jpg";
import exBridge from "@/assets/ex-bridge.jpg";
import exDeadlift from "@/assets/ex-deadlift.jpg";

export type Client = {
  id: string;
  name: string;
  goal: string;
  photo?: string;
  notes?: string;
  joinedOn: string;
};

export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
  image: string;
  defaultSets: number;
  defaultReps: string;
  defaultRestSec: number;
};

export type PlannedExercise = {
  exerciseId: string;
  sets: number;
  reps: string;
  restSec: number;
};

export type WorkoutPlan = {
  id: string;
  name: string;
  clientId: string;
  exercises: PlannedExercise[];
  createdAt: string;
};

export type Assignment = {
  id: string;
  workoutId: string;
  clientId: string;
  /** ISO date (yyyy-mm-dd) this workout is for */
  date: string;
  /** Weekly repeat days, e.g. ["Mon","Wed","Fri"]. Empty = one-time. */
  repeatDays: string[];
  /** exerciseId -> completed */
  completions: Record<string, boolean>;
};

export type HistoryEntry = {
  id: string;
  clientId: string;
  workoutName: string;
  date: string;
  completed: boolean;
};

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const sampleClients: Client[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    goal: "Lose weight",
    photo: clientPriya,
    notes: "Prefers morning sessions. Knee-friendly exercises only.",
    joinedOn: "12 Aug 2026",
  },
  {
    id: "c2",
    name: "Rohan Mehta",
    goal: "Build muscle",
    photo: clientRohan,
    notes: "Has a pair of 10kg dumbbells at home.",
    joinedOn: "3 Sep 2026",
  },
  {
    id: "c3",
    name: "Anjali Patel",
    goal: "Stay active",
    photo: clientAnjali,
    notes: "42 years old. Enjoys walking, new to strength work.",
    joinedOn: "20 Jul 2026",
  },
  {
    id: "c4",
    name: "Vikram Singh",
    goal: "Get stronger",
    photo: clientVikram,
    notes: "Plays weekend cricket. Focus on legs and core.",
    joinedOn: "28 Aug 2026",
  },
];

export const exerciseLibrary: Exercise[] = [
  { id: "e1", name: "Push-ups", bodyPart: "Chest & arms", image: exPushup, defaultSets: 3, defaultReps: "10", defaultRestSec: 60 },
  { id: "e2", name: "Bodyweight Squats", bodyPart: "Legs", image: exSquat, defaultSets: 3, defaultReps: "15", defaultRestSec: 60 },
  { id: "e3", name: "Plank", bodyPart: "Core", image: exPlank, defaultSets: 3, defaultReps: "30 sec", defaultRestSec: 45 },
  { id: "e4", name: "Lunges", bodyPart: "Legs", image: exLunge, defaultSets: 3, defaultReps: "12 each leg", defaultRestSec: 60 },
  { id: "e5", name: "Bicep Curls", bodyPart: "Arms", image: exCurl, defaultSets: 3, defaultReps: "12", defaultRestSec: 60 },
  { id: "e6", name: "Shoulder Press", bodyPart: "Shoulders", image: exPress, defaultSets: 3, defaultReps: "10", defaultRestSec: 60 },
  { id: "e7", name: "Glute Bridge", bodyPart: "Hips & core", image: exBridge, defaultSets: 3, defaultReps: "15", defaultRestSec: 45 },
  { id: "e8", name: "Deadlift", bodyPart: "Full body", image: exDeadlift, defaultSets: 3, defaultReps: "8", defaultRestSec: 90 },
];

export const exerciseById = (id: string) => exerciseLibrary.find((e) => e.id === id);
export const clientById = (clients: Client[], id: string | null | undefined) =>
  clients.find((c) => c.id === id);
