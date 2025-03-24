export interface WorkoutEntry {
  date: string
  sets: number
  reps: number
  weight: number | string
}

export const saveWorkoutEntry = (exerciseId: string, entry: WorkoutEntry) => {
  const data = localStorage.getItem("workoutData")
  const parsed = data ? JSON.parse(data) : {}
  if (!parsed[exerciseId]) parsed[exerciseId] = []
  parsed[exerciseId].push(entry)
  localStorage.setItem("workoutData", JSON.stringify(parsed))
}

export const getWorkoutHistory = (exerciseId: string): WorkoutEntry[] => {
  const data = localStorage.getItem("workoutData")
  const parsed = data ? JSON.parse(data) : {}
  return parsed[exerciseId] || []
}

