import { Button } from "@/components/ui/button"
import type { WorkoutDay } from "@/lib/types"
import { getLastWorkoutLog } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { CalendarDays } from "lucide-react"
import { MiniCalendar } from "./mini-calendar"

interface WorkoutSelectorProps {
  onSelectDay: (day: WorkoutDay) => void
  selectedDay: WorkoutDay | null
}

export function WorkoutSelector({ onSelectDay, selectedDay }: WorkoutSelectorProps) {
  const lastWorkoutA = getLastWorkoutLog("A")
  const lastWorkoutB = getLastWorkoutLog("B")

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-center">Selecciona tu rutina</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => onSelectDay("A")}
            className={`h-24 rounded-xl border-2 ${selectedDay === "A" ? "border-green-500 bg-green-500/10" : "border-zinc-700"}`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">A</span>
              {lastWorkoutA && (
                <span className="text-xs text-zinc-400 mt-1">Último: {formatDate(lastWorkoutA.date, true)}</span>
              )}
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => onSelectDay("B")}
            className={`h-24 rounded-xl border-2 ${selectedDay === "B" ? "border-green-500 bg-green-500/10" : "border-zinc-700"}`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">B</span>
              {lastWorkoutB && (
                <span className="text-xs text-zinc-400 mt-1">Último: {formatDate(lastWorkoutB.date, true)}</span>
              )}
            </div>
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-zinc-400">
        <div className="flex items-center justify-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>Último entrenamiento:</span>
        </div>
        {lastWorkoutA && lastWorkoutB ? (
          <div className="mt-1">
            {new Date(lastWorkoutA.date) > new Date(lastWorkoutB.date) ? (
              <span>Día A - {formatDate(lastWorkoutA.date)}</span>
            ) : (
              <span>Día B - {formatDate(lastWorkoutB.date)}</span>
            )}
          </div>
        ) : lastWorkoutA ? (
          <div className="mt-1">
            <span>Día A - {formatDate(lastWorkoutA.date)}</span>
          </div>
        ) : lastWorkoutB ? (
          <div className="mt-1">
            <span>Día B - {formatDate(lastWorkoutB.date)}</span>
          </div>
        ) : (
          <div className="mt-1">
            <span>No hay entrenamientos registrados</span>
          </div>
        )}
      </div>

      <MiniCalendar />
    </div>
  )
}

