import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { WorkoutLog, Exercise } from "./types"

// Función para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para formatear fechas
export function formatDate(dateString: string, shortFormat = false): string {
  if (shortFormat) {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "numeric",
    }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  }
  return new Date(dateString).toLocaleDateString("es-ES", options)
}

// Función para guardar logs en localStorage
export function saveWorkoutLog(log: WorkoutLog): void {
  const logs = getWorkoutLogs()
  logs.push(log)
  localStorage.setItem("workoutLogs", JSON.stringify(logs))
}

// Función para obtener logs de localStorage
export function getWorkoutLogs(): WorkoutLog[] {
  if (typeof window === "undefined") return []
  const logsJson = localStorage.getItem("workoutLogs")
  return logsJson ? JSON.parse(logsJson) : []
}

// Función para obtener el último log de un día específico
export function getLastWorkoutLog(day: "A" | "B"): WorkoutLog | null {
  const logs = getWorkoutLogs()
  return (
    logs.filter((log) => log.day === day).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ||
    null
  )
}

// Función para guardar el plan de entrenamiento personalizado
export function saveWorkoutPlan(plan: { dayA: Exercise[]; dayB: Exercise[] }): void {
  localStorage.setItem("workoutPlan", JSON.stringify(plan))
}

// Función para obtener el plan de entrenamiento personalizado
export function getWorkoutPlan(): { dayA: Exercise[]; dayB: Exercise[] } | null {
  if (typeof window === "undefined") return null
  const planJson = localStorage.getItem("workoutPlan")
  return planJson ? JSON.parse(planJson) : null
}

// Función para obtener las fechas de entrenamiento
export function getWorkoutDates(): string[] {
  const logs = getWorkoutLogs()
  return logs.map((log) => log.date)
}

