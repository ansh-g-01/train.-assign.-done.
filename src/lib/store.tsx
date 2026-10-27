import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DAY_LABELS,
  exerciseById,
  sampleClients,
  type Assignment,
  type Client,
  type HistoryEntry,
  type PlannedExercise,
  type WorkoutPlan,
} from "@/data/sample";
import { todayISO } from "@/lib/dates";

export { DAY_LABELS };

/* ---------- date helpers around assignments ---------- */

export const assignmentApplies = (a: Assignment, isoDate: string) =>
  a.date === isoDate || (a.repeatDays?.includes(isoOfShort(isoDate)) ?? false);

// local import to avoid a circular import with dates.ts
function isoOfShort(isoDate: string) {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return names[new Date(`${isoDate}T00:00:00`).getDay()];
}

export function assignmentFor(
  assignments: Assignment[],
  clientId: string,
  isoDate: string,
): Assignment | null {
  return assignments.find((a) => a.clientId === clientId && assignmentApplies(a, isoDate)) ?? null;
}

export function assignmentProgress(
  assignments: Assignment[],
  workouts: WorkoutPlan[],
  clientId: string,
  isoDate: string,
): { assignment: Assignment; total: number; done: number } | null {
  const assignment = assignmentFor(assignments, clientId, isoDate);
  if (!assignment) return null;
  const workout = workouts.find((w) => w.id === assignment.workoutId);
  const total = workout?.exercises.length ?? 0;
  const done = workout
    ? workout.exercises.filter((ex) => assignment.completions[ex.exerciseId]).length
    : 0;
  return { assignment, total, done };
}

/* ---------- seed data ---------- */

const plan = (
  id: string,
  name: string,
  clientId: string,
  rows: [string, number, string, number, string?][],
): WorkoutPlan => ({
  id,
  name,
  clientId,
  createdAt: new Date().toISOString(),
  exercises: rows.map(([exerciseId, sets, reps, restSec, weight = ""]) => ({
    exerciseId,
    sets,
    reps,
    restSec,
    weight,
  })),
});

const seedWorkouts: WorkoutPlan[] = [
  plan("w1", "Full Body Basics", "c1", [
    ["e2", 3, "15", 60],
    ["e1", 3, "8", 60],
    ["e7", 3, "15", 45],
    ["e3", 3, "30 sec", 45],
  ]),
  plan("w2", "Upper Body Push", "c2", [
    ["e1", 4, "12", 60],
    ["e6", 3, "10", 60, "10 kg each hand"],
    ["e5", 3, "12", 60, "10 kg each hand"],
  ]),
  plan("w3", "Gentle Mobility", "c3", [
    ["e4", 2, "10 each leg", 45],
    ["e7", 2, "12", 45],
    ["e3", 2, "20 sec", 30],
  ]),
  plan("w4", "Legs & Core", "c4", [
    ["e2", 4, "20", 60],
    ["e4", 3, "12 each leg", 60],
    ["e8", 3, "8", 90, "40 kg"],
    ["e3", 3, "45 sec", 45],
  ]),
];

const today = todayISO();

const markAll = (workoutId: string, completions: Record<string, boolean> = {}) => {
  const w = seedWorkouts.find((x) => x.id === workoutId)!;
  w.exercises.forEach((ex) => (completions[ex.exerciseId] = true));
  return completions;
};

const seedAssignments: Assignment[] = [
  {
    id: "a1",
    workoutId: "w1",
    clientId: "c1",
    date: today,
    repeatDays: ["Mon", "Wed", "Fri"],
    completions: markAll("w1"),
  },
  {
    id: "a2",
    workoutId: "w2",
    clientId: "c2",
    date: today,
    repeatDays: [],
    completions: {},
  },
  {
    id: "a3",
    workoutId: "w3",
    clientId: "c3",
    date: today,
    repeatDays: ["Tue", "Thu", "Sat"],
    completions: markAll("w3"),
  },
  {
    id: "a4",
    workoutId: "w4",
    clientId: "c4",
    date: today,
    repeatDays: ["Mon", "Thu"],
    completions: {},
  },
];

const seedHistory: HistoryEntry[] = [
  {
    id: "h1",
    clientId: "c1",
    workoutName: "Full Body Basics",
    date: "2026-10-25",
    completed: true,
  },
  {
    id: "h2",
    clientId: "c1",
    workoutName: "Full Body Basics",
    date: "2026-10-22",
    completed: true,
  },
  {
    id: "h3",
    clientId: "c1",
    workoutName: "Morning Mobility",
    date: "2026-10-19",
    completed: false,
  },
  { id: "h4", clientId: "c2", workoutName: "Upper Body Push", date: "2026-10-24", completed: true },
  { id: "h5", clientId: "c2", workoutName: "Upper Body Push", date: "2026-10-21", completed: true },
  { id: "h6", clientId: "c3", workoutName: "Gentle Mobility", date: "2026-10-25", completed: true },
  { id: "h7", clientId: "c4", workoutName: "Legs & Core", date: "2026-10-23", completed: true },
  { id: "h8", clientId: "c4", workoutName: "Cricket Prep", date: "2026-10-20", completed: false },
];

/* ---------- store ---------- */

type AppState = {
  clients: Client[];
  workouts: WorkoutPlan[];
  assignments: Assignment[];
  history: HistoryEntry[];
  draft: WorkoutPlan | null;
  addClient: (name: string, goal: string) => void;
  startDraft: (clientId: string) => void;
  setDraftName: (name: string) => void;
  addDraftExercise: (exerciseId: string) => void;
  removeDraftExercise: (index: number) => void;
  moveDraftExercise: (from: number, to: number) => void;
  updateDraftExercise: (index: number, patch: Partial<PlannedExercise>) => void;
  assign: (date: string, repeatDays: string[]) => void;
  toggleCompletion: (assignmentId: string, exerciseId: string) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>(seedWorkouts);
  const [assignments, setAssignments] = useState<Assignment[]>(seedAssignments);
  const [history, setHistory] = useState<HistoryEntry[]>(seedHistory);
  const [draft, setDraft] = useState<WorkoutPlan | null>(null);

  const addClient = useCallback((name: string, goal: string) => {
    setClients((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        name,
        goal,
        joinedOn: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
    ]);
  }, []);

  const startDraft = useCallback((clientId: string) => {
    setDraft({
      id: `w${Date.now()}`,
      name: "New Workout",
      clientId,
      createdAt: new Date().toISOString(),
      exercises: [],
    });
  }, []);

  const setDraftName = useCallback((name: string) => {
    setDraft((d) => (d ? { ...d, name } : d));
  }, []);

  const addDraftExercise = useCallback((exerciseId: string) => {
    setDraft((d) => {
      if (!d || d.exercises.some((e) => e.exerciseId === exerciseId)) return d;
      const ex = exerciseById(exerciseId);
      if (!ex) return d;
      return {
        ...d,
        exercises: [
          ...d.exercises,
          {
            exerciseId,
            sets: ex.defaultSets,
            reps: ex.defaultReps,
            restSec: ex.defaultRestSec,
            weight: "",
          },
        ],
      };
    });
  }, []);

  const removeDraftExercise = useCallback((index: number) => {
    setDraft((d) => (d ? { ...d, exercises: d.exercises.filter((_, i) => i !== index) } : d));
  }, []);

  const moveDraftExercise = useCallback((from: number, to: number) => {
    setDraft((d) => {
      if (!d || to < 0 || to >= d.exercises.length || from === to) return d;
      const next = [...d.exercises];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...d, exercises: next };
    });
  }, []);

  const updateDraftExercise = useCallback((index: number, patch: Partial<PlannedExercise>) => {
    setDraft((d) =>
      d
        ? {
            ...d,
            exercises: d.exercises.map((ex, i) => (i === index ? { ...ex, ...patch } : ex)),
          }
        : d,
    );
  }, []);

  const assign = useCallback((date: string, repeatDays: string[]) => {
    setDraft((d) => {
      if (!d) return d;
      setWorkouts((prev) => [...prev, d]);
      setAssignments((prev) => [
        ...prev,
        {
          id: `a${Date.now()}`,
          workoutId: d.id,
          clientId: d.clientId,
          date,
          repeatDays,
          completions: {},
        },
      ]);
      return d; // keep draft so the success screen can show a summary
    });
  }, []);

  const toggleCompletion = useCallback((assignmentId: string, exerciseId: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, completions: { ...a.completions, [exerciseId]: !a.completions[exerciseId] } }
          : a,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      clients,
      workouts,
      assignments,
      history,
      draft,
      addClient,
      startDraft,
      setDraftName,
      addDraftExercise,
      removeDraftExercise,
      moveDraftExercise,
      updateDraftExercise,
      assign,
      toggleCompletion,
    }),
    [
      clients,
      workouts,
      assignments,
      history,
      draft,
      addClient,
      startDraft,
      setDraftName,
      addDraftExercise,
      removeDraftExercise,
      moveDraftExercise,
      updateDraftExercise,
      assign,
      toggleCompletion,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
