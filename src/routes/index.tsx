import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ChevronRight, Circle, Plus, X } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { assignmentProgress, useApp } from "@/lib/store";
import { todayISO } from "@/lib/dates";

const GOAL_OPTIONS = [
  "Lose weight",
  "Build muscle",
  "Get stronger",
  "Stay active",
  "Recover from injury",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "My Clients · FitCoach",
        description: "Your clients and their workouts for today, at a glance.",
      },
      { property: "og:title", content: "My Clients · FitCoach" },
      { property: "og:description", content: "Your clients and their workouts for today." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyClients,
});

function MyClients() {
  const { clients, assignments, workouts } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const today = todayISO();

  const doneToday = clients.filter((c) => {
    const p = assignmentProgress(assignments, workouts, c.id, today);
    return p && p.total > 0 && p.done === p.total;
  }).length;

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-16 pt-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">FitCoach</p>
        <h1 className="mt-1 text-3xl font-bold">My Clients</h1>
        <p className="mt-1 text-muted-foreground">
          {clients.length} clients · {doneToday} finished today's workout
        </p>
      </header>

      <button onClick={() => setAddOpen(true)} className="btn-hero mt-6">
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        Add Client
      </button>

      <ul className="mt-6 flex flex-col gap-3">
        {clients.map((client) => {
          const progress = assignmentProgress(assignments, workouts, client.id, today);
          const finished = progress && progress.total > 0 && progress.done === progress.total;
          return (
            <li key={client.id}>
              <Link to="/clients/$clientId" params={{ clientId: client.id }} className="tap-row">
                <Avatar name={client.name} photo={client.photo} className="h-14 w-14 text-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{client.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{client.goal}</p>
                </div>
                {finished ? (
                  <span className="chip chip-success whitespace-nowrap">
                    <CheckCircle2 className="h-4 w-4" /> Done today
                  </span>
                ) : progress ? (
                  <span className="chip chip-warn whitespace-nowrap">
                    <Circle className="h-4 w-4" /> {progress.done}/{progress.total} today
                  </span>
                ) : (
                  <span className="chip whitespace-nowrap">Rest day</span>
                )}
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Prototype — sample data only. Nothing is saved.
      </p>

      {addOpen && <AddClientSheet onClose={() => setAddOpen(false)} />}
    </main>
  );
}

function AddClientSheet({ onClose }: { onClose: () => void }) {
  const { addClient } = useApp();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(GOAL_OPTIONS[0]);

  const submit = () => {
    if (!name.trim()) return;
    addClient(name.trim(), goal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl bg-card p-6 shadow-lift sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Client</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="mt-5 block text-sm font-semibold">
          Client's name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sunita Rao"
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <p className="mt-4 text-sm font-semibold">Fitness goal</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                goal === g
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card hover:bg-secondary"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <button onClick={submit} disabled={!name.trim()} className="btn-hero mt-6">
          Save Client
        </button>
      </div>
    </div>
  );
}
