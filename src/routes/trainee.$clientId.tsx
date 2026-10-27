import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, Timer } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { exerciseById } from "@/data/sample";
import { assignmentProgress, useApp } from "@/lib/store";
import { todayISO } from "@/lib/dates";

export const Route = createFileRoute("/trainee/$clientId")({
  head: () => ({
    meta: [
      { title: "Today's Workout · FitCoach" },
      { name: "description", content: "The client's view of today's assigned workout." },
      { property: "og:title", content: "Today's Workout · FitCoach" },
      { property: "og:description", content: "The client's view of today's workout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TraineeWorkout,
});

function TraineeWorkout() {
  const { clientId } = Route.useParams();
  const { clients, workouts, assignments, toggleCompletion } = useApp();
  const client = clients.find((c) => c.id === clientId);
  if (!client) throw notFound();

  const progress = assignmentProgress(assignments, workouts, client.id, todayISO());
  const firstName = client.name.split(" ")[0];

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-16 pt-6">
      <Link
        to="/clients/$clientId"
        params={{ clientId: client.id }}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Trainer view
      </Link>

      <header className="mt-4 flex items-center gap-3">
        <Avatar name={client.name} photo={client.photo} className="h-14 w-14" />
        <div>
          <h1 className="text-2xl font-bold">{firstName}'s Workout</h1>
          <p className="text-sm text-muted-foreground">Today · {progress?.total ?? 0} exercises</p>
        </div>
      </header>

      {!progress || progress.total === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="text-lg font-semibold">No workout for today</p>
          <p className="mt-2 text-muted-foreground">
            {firstName} has nothing assigned today. Create a workout from the client profile to
            see it here.
          </p>
          <Link to="/clients/$clientId" params={{ clientId: client.id }} className="btn-hero mt-6">
            Go to {firstName}'s profile
          </Link>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>
                {progress.done} of {progress.total} done
              </span>
              <span className="text-muted-foreground">
                {Math.round((progress.done / progress.total) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success transition-all duration-300"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
            {progress.done === progress.total && (
              <p className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-success/10 py-3 text-center font-semibold text-success">
                <CheckCircle2 className="h-5 w-5" /> Great job, {firstName}! Workout complete.
              </p>
            )}
          </div>

          {/* Exercise cards */}
          <ul className="mt-5 flex flex-col gap-4">
            {workouts
              .find((w) => w.id === progress.assignment.workoutId)!
              .exercises.map((planned, index) => {
                const ex = exerciseById(planned.exerciseId)!;
                const done = !!progress.assignment.completions[planned.exerciseId];
                return (
                  <li
                    key={planned.exerciseId}
                    className={`rounded-2xl border-2 bg-card p-4 shadow-card transition-colors ${
                      done ? "border-success bg-success/5" : "border-border"
                    }`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={ex.image}
                        alt={`Demonstration of ${ex.name}`}
                        loading="lazy"
                        width={816}
                        height={816}
                        className={`h-28 w-28 shrink-0 rounded-xl object-cover ${done ? "opacity-70" : ""}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-muted-foreground">
                          Exercise {index + 1}
                        </p>
                        <p
                          className={`text-lg font-bold leading-snug ${
                            done ? "text-muted-foreground line-through" : ""
                          }`}
                        >
                          {ex.name}
                        </p>
                        <p className="mt-1 font-semibold text-primary">
                          {planned.sets} sets × {planned.reps}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                          <Timer className="h-4 w-4" /> Rest {planned.restSec} sec between sets
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCompletion(progress.assignment.id, planned.exerciseId)}
                      aria-pressed={done}
                      className={`btn-hero mt-4 ${done ? "btn-done" : ""}`}
                    >
                      {done ? (
                        <>
                          <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} /> Completed — tap to
                          undo
                        </>
                      ) : (
                        <>
                          <Circle className="h-5 w-5" strokeWidth={2.5} /> Mark as done
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
          </ul>
        </>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Prototype — sample data only. Nothing is saved.
      </p>
    </main>
  );
}
