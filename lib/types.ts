export type WorkoutDay = "A" | "B"

export interface Set {
  reps: number
  weight: number
  completed: boolean
}

export interface Exercise {
  id: string
  name: string
  targetSets: number
  targetReps: number
  weightType: "barbell" | "dumbbell" | "machine" // Para determinar la escala del gráfico
  editable?: boolean // Para permitir edición
  isExpanded?: boolean // Para controlar si está expandido
}

export interface WorkoutPlan {
  dayA: Exercise[]
  dayB: Exercise[]
}

export interface WorkoutLog {
  date: string
  day: WorkoutDay
  exercises: {
    exerciseId: string
    sets: Set[]
  }[]
}

