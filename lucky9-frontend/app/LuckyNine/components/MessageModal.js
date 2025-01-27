import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function MessageModal({SelectQuitGame}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">Out of Founds</h2>
          <p>Deposit or Exit the room</p>
          <div className=" space-y-2 flex flex-row items-center justify-center gap-2">
            <Button onClick={SelectQuitGame} className="w-full">
              Deposit
            </Button>
            <Button onClick={SelectQuitGame} className="w-full">
              Exit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MessageModal;
