import { Dumbbell, Timer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Exercise, PlannedExercise } from "@/data/sample";

/** Silent looping demo clip, so it behaves like a GIF. */
export function ExerciseDemo({ exercise }: { exercise: Exercise }) {
  return (
    <video
      key={exercise.video}
      src={exercise.video}
      poster={exercise.image}
      autoPlay
      loop
      muted
      playsInline
      aria-label={`Video showing how to do ${exercise.name}`}
      className="aspect-[4/3] w-full rounded-xl bg-black object-contain"
    />
  );
}

export function ExerciseDetail({
  exercise,
  planned,
  onOpenChange,
}: {
  exercise: Exercise | null;
  /** When given, also shows this client's sets, reps and recommended weight. */
  planned?: PlannedExercise | undefined;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!exercise} onOpenChange={onOpenChange}>
      {exercise && (
        <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl p-5">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">{exercise.name}</DialogTitle>
            <DialogDescription>{exercise.bodyPart}</DialogDescription>
          </DialogHeader>

          <ExerciseDemo exercise={exercise} />

          {planned && (
            <div className="flex flex-wrap gap-2">
              <span className="chip">
                {planned.sets} sets × {planned.reps}
              </span>
              <span className="chip">
                <Dumbbell className="h-4 w-4" /> {planned.weight || "Bodyweight"}
              </span>
              <span className="chip">
                <Timer className="h-4 w-4" /> Rest {planned.restSec} sec
              </span>
            </div>
          )}

          <div>
            <h3 className="font-bold">How to do it</h3>
            <ol className="mt-2 flex list-decimal flex-col gap-1.5 pl-5 text-[15px] leading-snug">
              {exercise.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
