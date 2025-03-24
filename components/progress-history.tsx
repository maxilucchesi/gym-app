"use client"

import { useEffect, useRef, useState } from "react"
import { getExerciseHistory } from "@/lib/data"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { workoutPlan } from "@/lib/data"

interface ProgressHistoryProps {
  exerciseId: string
}

export function ProgressHistory({ exerciseId }: ProgressHistoryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Determinar el tipo de peso para este ejercicio
  const findExercise = () => {
    const allExercises = [...workoutPlan.dayA, ...workoutPlan.dayB]
    return allExercises.find((e) => e.id === exerciseId)
  }

  const exercise = findExercise()
  const weightType = exercise?.weightType || "machine"

  useEffect(() => {
    if (!isExpanded) return

    const history = getExerciseHistory(exerciseId)
    if (!history || history.length === 0 || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar el canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Limpiar el canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Configurar márgenes
    const margin = { top: 10, right: 10, bottom: 20, left: 30 }
    const width = rect.width - margin.left - margin.right
    const height = rect.height - margin.top - margin.bottom

    // Obtener valores máximos para escalar
    let maxWeight = Math.max(...history.map((h) => h!.avgWeight))

    // Redondear hacia arriba según el tipo de peso
    if (weightType === "barbell") {
      maxWeight = Math.ceil(maxWeight / 5) * 5 // Múltiplos de 5 para barras
    } else {
      maxWeight = Math.ceil(maxWeight) // Múltiplos de 1 para mancuernas y máquinas
    }

    // Asegurar que maxWeight sea al menos 5 o 1 según el tipo
    maxWeight = Math.max(maxWeight, weightType === "barbell" ? 5 : 1)

    // Escalar datos
    const xScale = width / (history.length - 1 || 1)
    const yScale = height / maxWeight

    // Dibujar ejes
    ctx.beginPath()
    ctx.strokeStyle = "#2d3748" // Más oscuro para dark mode
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // Dibujar línea de peso
    ctx.beginPath()
    ctx.strokeStyle = "#47fa23" // Color neón
    ctx.lineWidth = 2

    history.forEach((point, i) => {
      if (!point) return
      const x = i * xScale + margin.left
      const y = height - point.avgWeight * yScale + margin.top

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Dibujar puntos
    history.forEach((point, i) => {
      if (!point) return
      const x = i * xScale + margin.left
      const y = height - point.avgWeight * yScale + margin.top

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#47fa23" // Color neón
      ctx.fill()

      // Mostrar el valor del peso encima del punto
      ctx.fillStyle = "#ffffff"
      ctx.font = '10px "Roboto Condensed", sans-serif'
      ctx.textAlign = "center"
      ctx.fillText(point.avgWeight.toFixed(1), x, y - 10)
    })

    // Dibujar etiquetas de peso en el eje Y
    ctx.fillStyle = "#a0aec0" // Gris claro para dark mode
    ctx.font = '10px "Roboto Condensed", sans-serif'
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    // Determinar el incremento según el tipo de peso
    const increment = weightType === "barbell" ? 5 : 1
    const numYTicks = Math.min(5, Math.floor(maxWeight / increment))

    for (let i = 0; i <= numYTicks; i++) {
      const value = (maxWeight / numYTicks) * i
      const y = height - value * yScale + margin.top

      // Solo mostrar valores enteros
      const displayValue = Math.round(value)
      ctx.fillText(displayValue.toString(), margin.left - 5, y)
    }
  }, [exerciseId, isExpanded, weightType])

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full flex items-center justify-between p-2 h-8 mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-xs">Historial de Progreso</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <Card className="p-2 bg-card/50 border-muted">
          <canvas ref={canvasRef} className="w-full h-32" style={{ width: "100%", height: "8rem" }} />
        </Card>
      )}
    </div>
  )
}

