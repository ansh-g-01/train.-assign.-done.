import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Repeat } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { DAY_LABELS, exerciseById, clientById } from "@/data/sample";
import { useApp } from "@/lib/store";
import { addDaysISO, prettyDate, todayISO } from "@/lib/dates";

export const Route = createFileRoute("/assign")({
  head: () => ({
    meta: [
      { title: "Assign Workout · FitCoach" },
      { name: "description", content: "Choose a date and repeat days, then assign the workout." },
      { property: "og:title", content: "Assign Workout · FitCoach" },
      { property: "og:description", content: "Choose a date and repeat days, then assign." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssignWorkout,
});

export function AssignWorkout() {
  const navigate = useNavigate();
  const { clients, workouts, draft, assign } = useApp();
  const client = clientById(clients, draft?.clientId);
  const workout = workouts.find((w) => w.id === draft?.id);

  useEffect(() => {
    if (!draft || !client) navigate({ to: "/" });
  }, [draft, client, navigate]);

  const today = todayISO();
  const [dateChoice, setDateChoice] = useState<"today" | "tomorrow" | "other">("today");
  const [otherDate, setOtherDate] = useState(addDaysISO(2));
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [assigned, setAssigned] = useState(false);

  if (!draft || !client) return null;

  const firstName = client.name.split(" ")[0];
  const chosenDate =
    dateChoice === "today" ? today : dateChoice === "tomorrow" ? addDaysISO(1) : otherDate;

  const toggleDay = (day: string) =>
    setRepeatDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));

  if (assigned) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-14 w-14 text-success" strokeWidth={2} />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Workout assigned!</h1>
        <p className="mt-2 text-muted-foreground">
          "{draft.name}" ({draft.exercises.length} exercises) is now on {firstName}'s plan for{" "}
          {prettyDate(chosenDate)}
          {repeatDays.length > 0 && ` and every ${repeatDays.join(", ")}`}.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            onClick={() => navigate({ to: "/trainee/$clientId", params: { clientId: client.id } })}
            className="btn-hero"
          >
            See it as {firstName} sees it
          </button>
          <button onClick={() => navigate({ to: "/" })} className="btn-secondary">
            Back to My Clients
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-40 pt-6">
      <button
        onClick={() => navigate({ to: "/builder" })}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to builder
      </button>

      <h1 className="mt-4 text-2xl font-bold">Assign Workout</h1>

      {/* Summary */}
      <section className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3">
          <Avatar name={client.name} photo={client.photo} className="h-14 w-14" />
          <div>
            <p className="font-semibold">{client.name}</p>
            <p className="text-sm text-muted-foreground">{client.goal}</p>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-lg font-semibold">{draft.name}</p>
          <ul className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
            {draft.exercises.map((p, i) => (
              <li key={p.exerciseId}>
                {i + 1}. {exerciseById(p.exerciseId)?.name} — {p.sets} sets × {p.reps}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Date */}
      <section className="mt-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <CalendarDays className="h-5 w-5 text-primary" /> When should {firstName} do it?
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ["today", "Today"],
              ["tomorrow", "Tomorrow"],
              ["other", "Other date"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setDateChoice(value)}
              className={`rounded-xl border px-3 py-3 text-base font-semibold transition-colors ${
                dateChoice === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card hover:bg-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {dateChoice === "other" && (
          <input
            type="date"
            value={otherDate}
            min={today}
            onChange={(e) => setOtherDate(e.target.value)}
            className="mt-3 w-full rounded-xl border border-input bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
          />
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {dateChoice === "other" ? prettyDate(otherDate) : prettyDate(chosenDate)}
        </p>
      </section>

      {/* Repeat */}
      <section className="mt-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Repeat className="h-5 w-5 text-primary" /> Repeat every week on
        </h2>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {DAY_LABELS.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              aria-pressed={repeatDays.includes(day)}
              className={`rounded-lg border px-1 py-2.5 text-sm font-semibold transition-colors ${
                repeatDays.includes(day)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card hover:bg-secondary"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {repeatDays.length > 0
            ? `Repeats every ${repeatDays.join(", ")}`
            : "Leave empty for a one-time workout."}
        </p>
      </section>

      {/* Sticky assign bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => {
              assign(chosenDate, repeatDays);
              setAssigned(true);
            }}
            className="btn-hero"
          >
            Assign to {firstName}
          </button>
        </div>
      </div>
    </main>
  );
}
