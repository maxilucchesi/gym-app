"use client"

import { useState, useEffect } from "react"
import { WorkoutSelector } from "@/components/workout-selector"
import { ExerciseList } from "@/components/exercise-list"
import { workoutPlan } from "@/lib/data"
import type { WorkoutDay, WorkoutLog, Set } from "@/lib/types"
import { saveWorkoutLog, formatDate, getWorkoutPlan } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null)
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)
  const [currentDate] = useState(new Date().toISOString().split("T")[0])
  const [customWorkoutPlan, setCustomWorkoutPlan] = useState(workoutPlan)

  useEffect(() => {
    // Cargar el plan de entrenamiento personalizado si existe
    const savedPlan = getWorkoutPlan()
    if (savedPlan) {
      setCustomWorkoutPlan(savedPlan)
    }
  }, [])

  const handleDaySelect = (day: WorkoutDay) => {
    setSelectedDay(day)
    setIsWorkoutComplete(false)
  }

  const handleWorkoutComplete = (exerciseData: { exerciseId: string; sets: Set[] }[]) => {
    // Guardar el registro de entrenamiento
    const workoutLog: WorkoutLog = {
      date: currentDate,
      day: selectedDay!,
      exercises: exerciseData,
    }

    saveWorkoutLog(workoutLog)
    setIsWorkoutComplete(true)
  }

  const startNewWorkout = () => {
    setSelectedDay(null)
    setIsWorkoutComplete(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background">
      <div className="w-full max-w-md">
        {!selectedDay && (
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-1">Tracker</h1>
            <p className="text-muted-foreground text-sm">{formatDate(currentDate)}</p>
          </header>
        )}

        {isWorkoutComplete ? (
          <Card className="w-full bg-card/50 border-primary/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold">¡Entrenamiento Completado!</h2>
              <p className="text-muted-foreground text-sm">Has completado tu entrenamiento del Día {selectedDay}</p>
            </CardHeader>
            <CardContent className="text-center pb-2">
              <p className="text-muted-foreground text-sm mb-4">Tus datos han sido guardados correctamente.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={startNewWorkout} className="w-full">
                Nuevo Entrenamiento
              </Button>
            </CardFooter>
          </Card>
        ) : selectedDay ? (
          <ExerciseList
            exercises={selectedDay === "A" ? customWorkoutPlan.dayA : customWorkoutPlan.dayB}
            day={selectedDay}
            onComplete={handleWorkoutComplete}
            onBack={() => setSelectedDay(null)}
          />
        ) : (
          <WorkoutSelector onSelectDay={handleDaySelect} selectedDay={selectedDay} />
        )}
      </div>
    </main>
  )
}

