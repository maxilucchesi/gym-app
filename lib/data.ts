import type { WorkoutPlan, WorkoutLog } from "./types"

export const workoutPlan: WorkoutPlan = {
  dayA: [
    {
      id: "mobility_hip",
      name: "Movilidad de cadera 90/90",
      targetSets: 3,
      targetReps: 10,
      weightType: "machine",
      editable: true,
    },
    { id: "bird_dog", name: "Bird Dog", targetSets: 3, targetReps: 10, weightType: "machine", editable: true },
    { id: "squat", name: "Sentadilla con Barra", targetSets: 4, targetReps: 8, weightType: "barbell", editable: true },
    {
      id: "bench_press",
      name: "Press Banca con Barra",
      targetSets: 4,
      targetReps: 8,
      weightType: "barbell",
      editable: true,
    },
    {
      id: "lat_pulldown",
      name: "Jalón al Pecho (Polea)",
      targetSets: 3,
      targetReps: 10,
      weightType: "machine",
      editable: true,
    },
    {
      id: "shoulder_press",
      name: "Press Militar con Mancuernas",
      targetSets: 3,
      targetReps: 10,
      weightType: "dumbbell",
      editable: true,
    },
    { id: "bicep_curl", name: "Curl de Bíceps", targetSets: 3, targetReps: 12, weightType: "dumbbell", editable: true },
    {
      id: "ab_crunch",
      name: "Crunch en Máquina o Polea",
      targetSets: 3,
      targetReps: 15,
      weightType: "machine",
      editable: true,
    },
  ],
  dayB: [
    {
      id: "hip_flexor",
      name: "Estiramiento de flexor de cadera",
      targetSets: 3,
      targetReps: 10,
      weightType: "machine",
      editable: true,
    },
    {
      id: "t_spine",
      name: "Rotaciones de columna (T-Spine)",
      targetSets: 3,
      targetReps: 10,
      weightType: "machine",
      editable: true,
    },
    { id: "deadlift", name: "Peso Muerto", targetSets: 4, targetReps: 8, weightType: "barbell", editable: true },
    { id: "barbell_row", name: "Remo con Barra", targetSets: 4, targetReps: 8, weightType: "barbell", editable: true },
    {
      id: "incline_press",
      name: "Press Inclinado con Mancuernas",
      targetSets: 3,
      targetReps: 10,
      weightType: "dumbbell",
      editable: true,
    },
    {
      id: "leg_extension",
      name: "Extensión de Cuádriceps",
      targetSets: 3,
      targetReps: 12,
      weightType: "machine",
      editable: true,
    },
    {
      id: "tricep_extension",
      name: "Extensión de Tríceps en Polea",
      targetSets: 3,
      targetReps: 12,
      weightType: "machine",
      editable: true,
    },
    {
      id: "reverse_crunch",
      name: "Crunch Inverso",
      targetSets: 3,
      targetReps: 15,
      weightType: "machine",
      editable: true,
    },
  ],
}

// Generar datos de ejemplo para el historial
export const generateSampleLogs = (): WorkoutLog[] => {
  const logs: WorkoutLog[] = []
  const now = new Date()

  // Generar registros para las últimas 4 semanas
  for (let i = 0; i < 8; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i * 3) // Cada 3 días

    const day: "A" | "B" = i % 2 === 0 ? "A" : "B"
    const exercises = workoutPlan[day === "A" ? "dayA" : "dayB"].map((exercise) => {
      // Simular progresión de peso según el tipo de ejercicio
      let baseWeight = 0

      if (exercise.weightType === "barbell") {
        baseWeight =
          exercise.id === "squat"
            ? 80
            : exercise.id === "bench_press"
              ? 60
              : exercise.id === "deadlift"
                ? 100
                : exercise.id === "barbell_row"
                  ? 50
                  : 40
      } else if (exercise.weightType === "dumbbell") {
        baseWeight =
          exercise.id === "shoulder_press"
            ? 16
            : exercise.id === "incline_press"
              ? 20
              : exercise.id === "bicep_curl"
                ? 12
                : 10
      } else {
        baseWeight =
          exercise.id === "lat_pulldown"
            ? 50
            : exercise.id === "leg_extension"
              ? 40
              : exercise.id === "tricep_extension"
                ? 25
                : exercise.id === "ab_crunch"
                  ? 30
                  : 0
      }

      // Incremento gradual de peso
      const weightIncrement = Math.floor(i / 2) * (exercise.weightType === "barbell" ? 5 : 2)
      const weight = baseWeight - weightIncrement

      return {
        exerciseId: exercise.id,
        sets: Array(exercise.targetSets)
          .fill(0)
          .map(() => ({
            reps: exercise.targetReps,
            weight:
              weight +
              (Math.random() * (exercise.weightType === "barbell" ? 5 : 2) -
                (exercise.weightType === "barbell" ? 2.5 : 1)),
            completed: true,
          })),
      }
    })

    logs.push({
      date: date.toISOString().split("T")[0],
      day,
      exercises,
    })
  }

  return logs
}

export const sampleLogs = generateSampleLogs()

// Función para obtener el historial de un ejercicio específico
export const getExerciseHistory = (exerciseId: string) => {
  return sampleLogs
    .filter((log) => log.exercises.some((e) => e.exerciseId === exerciseId))
    .map((log) => {
      const exercise = log.exercises.find((e) => e.exerciseId === exerciseId)
      if (!exercise) return null

      // Calcular el promedio de peso y repeticiones
      const totalSets = exercise.sets.length
      const totalWeight = exercise.sets.reduce((sum, set) => sum + set.weight, 0)
      const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0)

      return {
        date: log.date,
        avgWeight: totalWeight / totalSets,
        avgReps: totalReps / totalSets,
        totalVolume: exercise.sets.reduce((sum, set) => sum + set.weight * set.reps, 0),
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime())
    .slice(-4) // Solo las últimas 4 sesiones
}

// Función para obtener las fechas de entrenamiento para el calendario
export const getWorkoutDates = () => {
  const logs = [...sampleLogs]
  return logs.map((log) => log.date)
}

