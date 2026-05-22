"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Plus, Users } from "lucide-react"
import type { Participant } from "@/lib/types"

interface ParticipantManagerProps {
  participants: Participant[]
  onParticipantsChange: (participants: Participant[]) => void
}

export function ParticipantManager({ participants, onParticipantsChange }: ParticipantManagerProps) {
  const [newName, setNewName] = useState("")

  const addParticipant = () => {
    if (newName.trim()) {
      const newParticipant: Participant = {
        id: crypto.randomUUID(),
        name: newName.trim(),
      }
      onParticipantsChange([...participants, newParticipant])
      setNewName("")
    }
  }

  const removeParticipant = (id: string) => {
    onParticipantsChange(participants.filter((p) => p.id !== id))
  }

  return (
    <Card className="p-6 border-2 border-primary">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-primary">Participants</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter participant name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addParticipant()}
          className="flex-1 bg-background border-primary"
        />
        <Button onClick={addParticipant} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {participants.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No participants yet. Add someone to get started!
          </p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 bg-secondary rounded border border-primary"
            >
              <span className="font-medium text-foreground">{participant.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeParticipant(participant.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
