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
// Demo clips: free stock videos from Pexels (https://www.pexels.com/license/), trimmed to
// 10 s, muted and compressed. Source: https://www.pexels.com/video/<id>/
import video1 from "@/assets/videos/e1.mp4"; // 6893310
import video2 from "@/assets/videos/e2.mp4"; // 7426039
import video3 from "@/assets/videos/e3.mp4"; // 6023268
import video4 from "@/assets/videos/e4.mp4"; // 8233047
import video5 from "@/assets/videos/e5.mp4"; // 6455077
import video6 from "@/assets/videos/e6.mp4"; // 4367541
import video7 from "@/assets/videos/e7.mp4"; // 6525487
import video8 from "@/assets/videos/e8.mp4"; // 7674502

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
  /** Short silent demo clip, played on a loop. */
  video: string;
  /** 3–4 short, plain-English steps. */
  instructions: string[];
  /** Placeholder shown in the weight field, e.g. "Bodyweight" or "5 kg each hand". */
  weightHint: string;
  defaultSets: number;
  defaultReps: string;
  defaultRestSec: number;
};

export type PlannedExercise = {
  exerciseId: string;
  sets: number;
  reps: string;
  restSec: number;
  /** Trainer's recommended weight for this client, e.g. "8 kg each hand". Empty = bodyweight. */
  weight: string;
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
  {
    id: "e1",
    name: "Push-ups",
    bodyPart: "Chest & arms",
    image: exPushup,
    video: video1,
    instructions: [
      "Hands on the floor, a little wider than your shoulders.",
      "Keep your body straight from head to heels.",
      "Lower your chest until it almost touches the floor.",
      "Push back up and breathe out.",
    ],
    weightHint: "Bodyweight",
    defaultSets: 3,
    defaultReps: "10",
    defaultRestSec: 60,
  },
  {
    id: "e2",
    name: "Bodyweight Squats",
    bodyPart: "Legs",
    image: exSquat,
    video: video2,
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Push your hips back and bend your knees, like sitting in a chair.",
      "Keep your chest up and knees in line with your toes.",
      "Push through your heels to stand back up.",
    ],
    weightHint: "Bodyweight",
    defaultSets: 3,
    defaultReps: "15",
    defaultRestSec: 60,
  },
  {
    id: "e3",
    name: "Plank",
    bodyPart: "Core",
    image: exPlank,
    video: video3,
    instructions: [
      "Rest on your forearms and toes, elbows under your shoulders.",
      "Keep your body in one straight line. Don't let your hips drop.",
      "Tighten your stomach and keep breathing.",
      "Hold for the time given.",
    ],
    weightHint: "Bodyweight",
    defaultSets: 3,
    defaultReps: "30 sec",
    defaultRestSec: 45,
  },
  {
    id: "e4",
    name: "Lunges",
    bodyPart: "Legs",
    image: exLunge,
    video: video4,
    instructions: [
      "Stand tall with hands on your hips.",
      "Take a big step forward and lower your back knee towards the floor.",
      "Keep your front knee above your ankle.",
      "Push back up and switch legs.",
    ],
    weightHint: "Bodyweight or 5 kg each hand",
    defaultSets: 3,
    defaultReps: "12 each leg",
    defaultRestSec: 60,
  },
  {
    id: "e5",
    name: "Bicep Curls",
    bodyPart: "Arms",
    image: exCurl,
    video: video5,
    instructions: [
      "Stand straight with a dumbbell in each hand, palms facing forward.",
      "Keep your elbows close to your sides.",
      "Curl the weights up to your shoulders.",
      "Lower them slowly. Don't swing your body.",
    ],
    weightHint: "e.g. 5 kg each hand",
    defaultSets: 3,
    defaultReps: "12",
    defaultRestSec: 60,
  },
  {
    id: "e6",
    name: "Shoulder Press",
    bodyPart: "Shoulders",
    image: exPress,
    video: video6,
    instructions: [
      "Sit with your back supported, a dumbbell in each hand at shoulder height.",
      "Palms face forward.",
      "Press the weights straight up until your arms are almost straight.",
      "Lower slowly back to your shoulders.",
    ],
    weightHint: "e.g. 5 kg each hand",
    defaultSets: 3,
    defaultReps: "10",
    defaultRestSec: 60,
  },
  {
    id: "e7",
    name: "Glute Bridge",
    bodyPart: "Hips & core",
    image: exBridge,
    video: video7,
    instructions: [
      "Lie on your back, knees bent, feet flat on the floor.",
      "Push through your heels and lift your hips up.",
      "Squeeze your glutes at the top for one second.",
      "Lower slowly back down.",
    ],
    weightHint: "Bodyweight",
    defaultSets: 3,
    defaultReps: "15",
    defaultRestSec: 45,
  },
  {
    id: "e8",
    name: "Deadlift",
    bodyPart: "Full body",
    image: exDeadlift,
    video: video8,
    instructions: [
      "Stand with feet hip-width apart, bar over the middle of your feet.",
      "Bend your knees and hips, keep your back straight, and grip the bar.",
      "Push through your legs and stand up tall, keeping the bar close.",
      "Lower the bar back down with control.",
    ],
    weightHint: "e.g. 30 kg",
    defaultSets: 3,
    defaultReps: "8",
    defaultRestSec: 90,
  },
];

export const exerciseById = (id: string) => exerciseLibrary.find((e) => e.id === id);
export const clientById = (clients: Client[], id: string | null | undefined) =>
  clients.find((c) => c.id === id);
