"use client"

import { useState } from "react"
import type { Exercise } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExerciseEditorProps {
  exercise: Exercise
  onSave: (updatedExercise: Exercise) => void
}

export function ExerciseEditor({ exercise, onSave }: ExerciseEditorProps) {
  const [name, setName] = useState(exercise.name)
  const [targetSets, setTargetSets] = useState(exercise.targetSets)
  const [targetReps, setTargetReps] = useState(exercise.targetReps)
  const [weightType, setWeightType] = useState(exercise.weightType)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    onSave({
      ...exercise,
      name,
      targetSets,
      targetReps,
      weightType: weightType as "barbell" | "dumbbell" | "machine",
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
          <Edit2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Ejercicio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sets">Series</Label>
              <Input
                id="sets"
                type="number"
                value={targetSets}
                onChange={(e) => setTargetSets(Number.parseInt(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reps">Repeticiones</Label>
              <Input
                id="reps"
                type="number"
                value={targetReps}
                onChange={(e) => setTargetReps(Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weightType">Tipo de Peso</Label>
            <Select
              value={weightType}
              onValueChange={(value) => setWeightType(value as "barbell" | "dumbbell" | "machine")}
            >
              <SelectTrigger id="weightType">
                <SelectValue placeholder="Selecciona el tipo de peso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="barbell">Barra</SelectItem>
                <SelectItem value="dumbbell">Mancuernas</SelectItem>
                <SelectItem value="machine">Máquina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

