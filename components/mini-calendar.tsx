import { useState, useEffect } from "react"
import { getWorkoutLogs } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function MiniCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [workoutDates, setWorkoutDates] = useState<string[]>([])

  useEffect(() => {
    // Obtener fechas de entrenamiento desde localStorage
    const logs = getWorkoutLogs()
    const dates = logs.map((log) => log.date)
    setWorkoutDates(dates)
  }, [])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    const days = []

    // Días vacíos al principio
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split("T")[0]
      const isWorkoutDay = workoutDates.includes(dateString)
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div
          key={day}
          className={cn(
            "w-8 h-8 flex items-center justify-center text-xs rounded-full",
            isWorkoutDay && "bg-primary/20 text-primary font-bold",
            isToday && "border border-primary",
          )}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]

  return (
    <div className="w-full mt-6 mb-2">
      <div className="text-center mb-2 text-sm font-medium">
        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {dayNames.map((day) => (
          <div key={day} className="text-xs text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
    </div>
  )
}

