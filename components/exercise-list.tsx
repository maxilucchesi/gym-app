import { useState, useEffect } from "react"
import { type Exercise, Set, type WorkoutDay } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, Check, CheckCircle } from "lucide-react"
import { ProgressHistory } from "./progress-history"
import { ExerciseEditor } from "./exercise-editor"
import { saveWorkoutPlan, getWorkoutPlan } from "@/lib/utils"
import { workoutPlan as defaultWorkoutPlan } from "@/lib/data"

interface ExerciseListProps {
  exercises: Exercise[]
  day: WorkoutDay
  onComplete: (exerciseData: { exerciseId: string; sets: Set[] }[]) => void
  onBack: () => void
}

export function ExerciseList({ exercises: initialExercises, day, onComplete, onBack }: ExerciseListProps) {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)

  const [exerciseData, setExerciseData] = useState<{ [key: string]: Set[] }>(
    exercises.reduce(
      (acc, exercise) => {
        acc[exercise.id] = Array(exercise.targetSets)
          .fill(0)
          .map(() => ({
            reps: 0,
            weight: 0,
            completed: false,
          }))
        return acc
      },
      {} as { [key: string]: Set[] },
    ),
  )

  const [expandedExercise, setExpandedExercise] = useState<string | null>(exercises[0]?.id || null)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Cargar el plan de entrenamiento personalizado si existe
    const savedPlan = getWorkoutPlan()
    if (savedPlan) {
      setExercises(savedPlan[day === "A" ? "dayA" : "dayB"])

      // Reinicializar los datos de ejercicio
      setExerciseData(
        savedPlan[day === "A" ? "dayA" : "dayB"].reduce(
          (acc, exercise) => {
            acc[exercise.id] = Array(exercise.targetSets)
              .fill(0)
              .map(() => ({
                reps: 0,
                weight: 0,
                completed: false,
              }))
            return acc
          },
          {} as { [key: string]: Set[] },
        ),
      )
    }
  }, [day])

  const handleSetChange = (exerciseId: string, setIndex: number, field: "reps" | "weight", value: number) => {
    setExerciseData((prev) => {
      const newSets = [...prev[exerciseId]]
      newSets[setIndex] = {
        ...newSets[setIndex],
        [field]: value,
      }
      return { ...prev, [exerciseId]: newSets }
    })
  }

  const handleSetComplete = (exerciseId: string, setIndex: number) => {
    setExerciseData((prev) => {
      const newSets = [...prev[exerciseId]]
      newSets[setIndex] = {
        ...newSets[setIndex],
        completed: !newSets[setIndex].completed,
      }
      return { ...prev, [exerciseId]: newSets }
    })
  }

  const handleExerciseComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises)
    newCompleted.add(exerciseId)
    setCompletedExercises(newCompleted)

    // Retraer el ejercicio completado
    setExpandedExercise(null)

    // Encontrar el siguiente ejercicio no completado
    const nextExerciseIndex = exercises.findIndex((e) => e.id === exerciseId) + 1
    if (nextExerciseIndex < exercises.length) {
      const nextExerciseId = exercises[nextExerciseIndex].id
      if (!newCompleted.has(nextExerciseId)) {
        setTimeout(() => {
          setExpandedExercise(nextExerciseId)
        }, 300)
      }
    }
  }

  const handleExerciseUpdate = (updatedExercise: Exercise) => {
    const newExercises = exercises.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex))

    setExercises(newExercises)

    // Actualizar el plan de entrenamiento en localStorage
    const savedPlan = getWorkoutPlan() || defaultWorkoutPlan
    const updatedPlan = {
      ...savedPlan,
      [day === "A" ? "dayA" : "dayB"]: newExercises,
    }

    saveWorkoutPlan(updatedPlan)

    // Actualizar los datos de ejercicio si cambia el número de series
    if (updatedExercise.targetSets !== exerciseData[updatedExercise.id].length) {
      setExerciseData((prev) => {
        const currentSets = prev[updatedExercise.id] || []
        const newSets = Array(updatedExercise.targetSets)
          .fill(0)
          .map((_, i) => {
            return i < currentSets.length ? currentSets[i] : { reps: 0, weight: 0, completed: false }
          })

        return { ...prev, [updatedExercise.id]: newSets }
      })
    }
  }

  const handleFinishWorkout = () => {
    const formattedData = Object.entries(exerciseData).map(([exerciseId, sets]) => ({
      exerciseId,
      sets,
    }))

    onComplete(formattedData)
  }

  const areAllSetsCompleted = (exerciseId: string) => {
    return exerciseData[exerciseId].every((set) => set.completed)
  }

  const isAnyExerciseStarted = () => {
    return Object.values(exerciseData).some((sets) =>
      sets.some((set) => set.reps > 0 || set.weight > 0 || set.completed),
    )
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-auto">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-bold text-center flex-1 mr-8">Día {day}</h2>
      </div>

      <Accordion
        type="single"
        collapsible
        value={expandedExercise || undefined}
        onValueChange={(value) => setExpandedExercise(value)}
        className="space-y-3"
      >
        {exercises.map((exercise) => {
          const isCompleted = completedExercises.has(exercise.id)
          const allSetsCompleted = areAllSetsCompleted(exercise.id)

          return (
            <AccordionItem
              key={exercise.id}
              value={exercise.id}
              className={`border rounded-lg overflow-hidden ${isCompleted ? "border-primary/30 bg-primary/5" : allSetsCompleted ? "border-primary/20 bg-primary/5" : "border-border"}`}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-2">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    ) : allSetsCompleted ? (
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center mr-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground mr-2" />
                    )}
                    <span className="font-medium">{exercise.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground mr-2">
                      {exercise.targetSets} × {exercise.targetReps}
                    </div>
                    {exercise.editable && <ExerciseEditor exercise={exercise} onSave={handleExerciseUpdate} />}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                    <div className="col-span-2">Serie</div>
                    <div className="col-span-4">Reps</div>
                    <div className="col-span-4">Peso (kg)</div>
                    <div className="col-span-2"></div>
                  </div>

                  {Array.from({ length: exercise.targetSets }).map((_, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-2 text-center font-medium text-base">{setIndex + 1}</div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          value={exerciseData[exercise.id][setIndex]?.reps || ""}
                          onChange={(e) =>
                            handleSetChange(
                              exercise.id,
                              setIndex,
                              "reps",
                              e.target.value ? Number.parseInt(e.target.value) : 0,
                            )
                          }
                          className="h-9 bg-background text-base"
                          placeholder={`${exercise.targetReps}`}
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          value={exerciseData[exercise.id][setIndex]?.weight || ""}
                          onChange={(e) =>
                            handleSetChange(
                              exercise.id,
                              setIndex,
                              "weight",
                              e.target.value ? Number.parseFloat(e.target.value) : 0,
                            )
                          }
                          className="h-9 bg-background text-base"
                          placeholder="0"
                          step={exercise.weightType === "barbell" ? "5" : "1"}
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 rounded-full ${exerciseData[exercise.id][setIndex]?.completed ? "bg-primary/20" : ""}`}
                          onClick={() => handleSetComplete(exercise.id, setIndex)}
                        >
                          <CheckCircle
                            className={`h-5 w-5 ${exerciseData[exercise.id][setIndex]?.completed ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <Button
                      onClick={() => handleExerciseComplete(exercise.id)}
                      className="w-full"
                      variant={isCompleted ? "outline" : "default"}
                    >
                      {isCompleted ? "Completado" : "Completar Ejercicio"}
                    </Button>
                  </div>

                  <ProgressHistory exerciseId={exercise.id} />
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <div className="pt-4">
        <Button onClick={handleFinishWorkout} className="w-full" disabled={!isAnyExerciseStarted()}>
          Finalizar Sesión
        </Button>
      </div>
    </div>
  )
}

