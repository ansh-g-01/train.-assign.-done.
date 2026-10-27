import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  GripVertical,
  Minus,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { exerciseLibrary } from "@/data/sample";
import { useApp } from "@/lib/store";
import { clientById } from "@/data/sample";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Workout Builder · FitCoach" },
      { name: "description", content: "Build a workout from your exercise library." },
      { property: "og:title", content: "Workout Builder · FitCoach" },
      { property: "og:description", content: "Build a workout from your exercise library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkoutBuilder,
});

const REST_OPTIONS = [30, 45, 60, 90];

function WorkoutBuilder() {
  const navigate = useNavigate();
  const {
    clients,
    draft,
    setDraftName,
    addDraftExercise,
    removeDraftExercise,
    moveDraftExercise,
    updateDraftExercise,
  } = useApp();

  const client = clientById(clients, draft?.clientId);

  useEffect(() => {
    if (!draft || !client) navigate({ to: "/" });
  }, [draft, client, navigate]);

  const [search, setSearch] = useState("");
  const dragFrom = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  if (!draft || !client) return null;

  const firstName = client.name.split(" ")[0];
  const q = search.trim().toLowerCase();
  const filtered = exerciseLibrary.filter(
    (ex) => !q || ex.name.toLowerCase().includes(q) || ex.bodyPart.toLowerCase().includes(q)
  );
  const addedIds = new Set(draft.exercises.map((e) => e.exerciseId));

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-32 pt-6">
      <button
        onClick={() => navigate({ to: "/clients/$clientId", params: { clientId: client.id } })}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {firstName}
      </button>

      <h1 className="mt-4 text-2xl font-bold">Workout Builder</h1>
      <p className="mt-1 text-muted-foreground">
        Building a workout for <span className="font-semibold text-foreground">{firstName}</span>
      </p>

      {/* Workout name */}
      <label className="mt-5 block text-sm font-semibold">
        Workout name
        <input
          value={draft.name}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="e.g. Full Body Basics"
          className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
        />
      </label>

      {/* Exercise library */}
      <section className="mt-6">
        <h2 className="text-lg font-bold">Exercise Library</h2>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises…"
            aria-label="Search exercises"
            className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-base outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <ul className="mt-3 flex flex-col gap-2">
          {filtered.map((ex) => {
            const added = addedIds.has(ex.id);
            return (
              <li
                key={ex.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
              >
                <img
                  src={ex.image}
                  alt={ex.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{ex.name}</p>
                  <p className="text-sm text-muted-foreground">{ex.bodyPart}</p>
                </div>
                {added ? (
                  <span className="chip chip-success whitespace-nowrap">Added ✓</span>
                ) : (
                  <button
                    onClick={() => addDraftExercise(ex.id)}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} /> Add
                  </button>
                )}
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-muted-foreground">
              No exercises match "{search}"
            </li>
          )}
        </ul>
      </section>

      {/* Selected exercises */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">Your Workout ({draft.exercises.length})</h2>
        {draft.exercises.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-6 text-center text-muted-foreground">
            Tap "Add" above to build the workout.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag rows (or use the arrows) to change the order.
            </p>
            <ul className="mt-3 flex flex-col gap-3">
              {draft.exercises.map((planned, index) => {
                const ex = exerciseLibrary.find((e) => e.id === planned.exerciseId)!;
                return (
                  <li
                    key={planned.exerciseId}
                    draggable
                    onDragStart={() => (dragFrom.current = index)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(index);
                    }}
                    onDragLeave={() => setDragOver((v) => (v === index ? null : v))}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragFrom.current !== null) moveDraftExercise(dragFrom.current, index);
                      dragFrom.current = null;
                      setDragOver(null);
                    }}
                    onDragEnd={() => {
                      dragFrom.current = null;
                      setDragOver(null);
                    }}
                    className={`rounded-2xl border bg-card p-4 shadow-card transition-colors ${
                      dragOver === index && dragFrom.current !== index
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical
                        className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground"
                        aria-hidden="true"
                      />
                      <img
                        src={ex.image}
                        alt={ex.name}
                        loading="lazy"
                        width={816}
                        height={816}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                      <p className="min-w-0 flex-1 truncate font-semibold">
                        {index + 1}. {ex.name}
                      </p>
                      <div className="flex shrink-0 flex-col gap-1">
                        <button
                          aria-label={`Move ${ex.name} up`}
                          disabled={index === 0}
                          onClick={() => moveDraftExercise(index, index - 1)}
                          className="rounded-md border border-input p-1 disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Move ${ex.name} down`}
                          disabled={index === draft.exercises.length - 1}
                          onClick={() => moveDraftExercise(index, index + 1)}
                          className="rounded-md border border-input p-1 disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-end gap-4 border-t border-border pt-3">
                      <Stepper
                        label="Sets"
                        value={planned.sets}
                        onChange={(v) => updateDraftExercise(index, { sets: v })}
                      />
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Reps
                        <input
                          value={planned.reps}
                          onChange={(e) => updateDraftExercise(index, { reps: e.target.value })}
                          inputMode="text"
                          className="mt-1 block w-24 rounded-lg border border-input bg-background px-2 py-2 text-center text-base font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Rest
                        <select
                          value={planned.restSec}
                          onChange={(e) =>
                            updateDraftExercise(index, { restSec: Number(e.target.value) })
                          }
                          className="mt-1 block rounded-lg border border-input bg-background px-2 py-2 text-base font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
                        >
                          {REST_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s} sec
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        aria-label={`Remove ${ex.name}`}
                        onClick={() => removeDraftExercise(index)}
                        className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto max-w-lg">
          <button
            disabled={draft.exercises.length === 0}
            onClick={() => navigate({ to: "/assign" })}
            className="btn-hero"
          >
            Next: Assign Workout ({draft.exercises.length}{" "}
            {draft.exercises.length === 1 ? "exercise" : "exercises"})
          </button>
        </div>
      </div>
    </main>
  );
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
      <div className="mt-1 flex items-center gap-2">
        <button
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(1, value - 1))}
          className="rounded-lg border border-input p-2 active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-lg font-semibold text-foreground">{value}</span>
        <button
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(10, value + 1))}
          className="rounded-lg border border-input p-2 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
