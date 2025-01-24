import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User } from 'lucide-react'

const BankerSelection = ({ players, onSelect }) => (
  <Card>
    <CardContent className="p-4">
      <h2 className="text-2xl font-bold mb-4">Select Banker</h2>
      <div className="grid gap-2">
        {players.map((player) => (
          <Button
            key={player}
            onClick={() => onSelect(player)}
            className="w-full justify-start"
            variant="outline"
          >
            <User className="mr-2 h-4 w-4" /> {player}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default BankerSelection