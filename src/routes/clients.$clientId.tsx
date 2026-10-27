import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Eye,
  Plus,
  XCircle,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { assignmentProgress, useApp } from "@/lib/store";
import { exerciseById } from "@/data/sample";
import { prettyShort, todayISO } from "@/lib/dates";

export const Route = createFileRoute("/clients/$clientId")({
  head: () => ({
    meta: [
      { title: "Client Profile · FitCoach" },
      { name: "description", content: "Client profile, current workout plan and history." },
      { property: "og:title", content: "Client Profile · FitCoach" },
      { property: "og:description", content: "Client profile, current plan and history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientProfile,
});

function ClientProfile() {
  const { clientId } = Route.useParams();
  const { clients, workouts, assignments, history, startDraft, assign } = useApp();
  const client = clients.find((c) => c.id === clientId);
  if (!client) throw notFound();

  const today = todayISO();
  const progress = assignmentProgress(assignments, workouts, client.id, today);
  const finished = progress && progress.total > 0 && progress.done === progress.total;

  // Current plan = the workout on the client's most recent assignment
  const currentPlan = (() => {
    for (let i = assignments.length - 1; i >= 0; i--) {
      if (assignments[i].clientId !== client.id) continue;
      const w = workouts.find((x) => x.id === assignments[i].workoutId);
      if (w) return w;
    }
    return null;
  })();

  const clientHistory = history
    .filter((h) => h.clientId === client.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const seedDemoAssignment = () => {
    // For interviews: lets the trainer jump straight to a filled trainee view
    startDraft(client.id);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-16 pt-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> My Clients
      </Link>

      <header className="mt-4 flex items-center gap-4">
        <Avatar name={client.name} photo={client.photo} className="h-20 w-20 text-2xl" />
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <span className="chip mt-1.5">{client.goal}</span>
        </div>
      </header>
      <p className="mt-2 text-sm text-muted-foreground">
        Client since {client.joinedOn}
        {client.notes ? ` · ${client.notes}` : ""}
      </p>

      {/* Today's workout status */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Today's workout
        </h2>
        {progress ? (
          <>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
              {finished ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" /> Completed
                </>
              ) : (
                <>
                  <ClipboardList className="h-5 w-5 text-primary" /> {progress.done} of{" "}
                  {progress.total} exercises done
                </>
              )}
            </p>
            <Link
              to="/trainee/$clientId"
              params={{ clientId: client.id }}
              className="btn-secondary mt-4"
            >
              <Eye className="h-5 w-5" /> Open today's workout
            </Link>
          </>
        ) : (
          <p className="mt-2 text-lg font-semibold text-muted-foreground">
            Nothing assigned for today
          </p>
        )}
      </section>

      {/* Current plan */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Current workout plan
        </h2>
        {currentPlan ? (
          <>
            <p className="mt-2 text-lg font-semibold">{currentPlan.name}</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
              {currentPlan.exercises.map((ex) => (
                <li key={ex.exerciseId}>
                  • {exerciseById(ex.exerciseId)?.name} — {ex.sets} sets × {ex.reps}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-2 text-lg font-semibold text-muted-foreground">No plan yet</p>
        )}
      </section>

      <button
        onClick={() => {
          seedDemoAssignment();
          // navigate after draft is set, via Link below handled by state — we use a form action instead
        }}
        className="hidden"
      />

      <CreateWorkoutButton clientId={client.id} clientName={client.name} />

      {/* History */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">Workout History</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {clientHistory.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="font-semibold">{h.workoutName}</p>
                <p className="text-sm text-muted-foreground">{prettyShort(h.date)}</p>
              </div>
              {h.completed ? (
                <span className="chip chip-success">
                  <CheckCircle2 className="h-4 w-4" /> Done
                </span>
              ) : (
                <span className="chip chip-warn">
                  <XCircle className="h-4 w-4" /> Missed
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Prototype — sample data only. Nothing is saved.
      </p>
    </main>
  );
}

function CreateWorkoutButton({ clientId, clientName }: { clientId: string; clientName: string }) {
  const { startDraft } = useApp();
  const navigate = useNavigate();
  return (
    <div className="mt-6 flex flex-col gap-3">
      <button
        onClick={() => {
          startDraft(clientId);
          navigate({ to: "/builder" });
        }}
        className="btn-hero"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        Create Workout for {clientName.split(" ")[0]}
      </button>
      <Link
        to="/trainee/$clientId"
        params={{ clientId }}
        className="btn-secondary"
      >
        <ChevronRight className="h-5 w-5" /> View as {clientName.split(" ")[0]} sees it
      </Link>
    </div>
  );
}
