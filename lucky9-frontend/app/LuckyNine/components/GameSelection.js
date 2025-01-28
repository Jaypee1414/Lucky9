import { React, useEffect } from "react";
import Image from "next/image";
import CustomizedSlider from "./SliderBet";

function GameSelection({
  gameId,
  socket,
  setGameState,
  playerIndex,
  gameState,
  value,
  isBanker,
  gamePhase,
  setIsPlayerCoin,
  isPlayerCoin,
}) {
  // Handle betting logic


  
  const handleBet = (playerBet) => {
    if (playerIndex === -1) return;
  
    const updatedMoney = gameState.players[playerIndex].money - Number(playerBet);
  
    setIsPlayerCoin(updatedMoney);
    // Emit the bet action to the server
    socket.emit("player-bet", {
      gameId,
      playerId: socket.id, // Identify the player making the bet
      playerBet: Number(playerBet),
    });
  };
  
  return (
    <div className="absolute bottom-0 left-0">
      <div
        className={`flex flex-row ${
          isBanker ? "justify-end" : "justify-between"
        }  px-10 w-screen items-center relative space-x-7`}
      >
        {isBanker ||
        gamePhase === "countdown" ||
        gamePhase === "selectBanker" ? null : (
          <div className="flex flex-row">
            <div className="relative w-auto h-auto">
              <button
                onClick={() => handleBet(2000)}
                disabled={
                  gamePhase === "drawPhase" ||
                  isBanker ||
                  gamePhase === "results" ||
                  isPlayerCoin < 2000
                }
                className={`h-20 w-auto cursor-pointer ${
                  gamePhase === "drawPhase" ||
                  isBanker ||
                  gamePhase === "results" ||
                  isPlayerCoin < 2000
                    ? "opacity-65 cursor-not-allowed"
                    : ""
                }`}
              >
                <Image
                  src="/image/ButtonGameBackground.svg"
                  width={40}
                  height={45}
                  alt="Circle Icon"
                  className="h-20 w-auto  cursor-pointer"
                />
                <div className="right-8 absolute bottom-1/2 ">
                  <div className=" flex flex-row  items-center w-full">
                    <Image
                      src="/image/GameCoin.svg"
                      width={40}
                      height={45}
                      alt="Circle Icon"
                      className="h-8 w-auto  "
                    />
                    <div className="font-jaro font-extrabold text-2xl bg-gradient-to-b from-[#FFD400] to-[#C6BF9A] bg-clip-text text-transparent">
                      2000
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <div className="mb-4">
              <CustomizedSlider gamePhase={gamePhase} />
            </div>
            <div className="relative w-auto h-auto ">
              <button
                onClick={() => handleBet(value)}
                disabled={
                  gamePhase === "drawPhase" ||
                  isBanker ||
                  gamePhase === "results" ||
                  isPlayerCoin < value
                }
                className={`h-20 w-auto cursor-pointer ${
                  gamePhase === "drawPhase" ||
                  isBanker ||
                  gamePhase === "results" ||
                  isPlayerCoin < value
                    ? "opacity-65 cursor-not-allowed"
                    : ""
                }`}
              >
                <Image
                  src="/image/ButtonGameBackground.svg"
                  width={40}
                  height={45}
                  alt="Circle Icon"
                  className="h-20 w-auto  cursor-pointer"
                />
                <div className="right-8 absolute bottom-1/2 ">
                  <div className=" flex flex-row  items-center w-full">
                    <Image
                      src="/image/GameCoin.svg"
                      width={40}
                      height={45}
                      alt="Circle Icon"
                      className="h-8 w-auto "
                    />
                    <div className="font-jaro font-extrabold text-2xl bg-gradient-to-b from-[#FFD400] to-[#C6BF9A] bg-clip-text text-transparent">
                      {value}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
        {/* right Side */}
        {gamePhase !== "countdown" && gamePhase !== "selectBanker" ? (
          <div className="flex flex-row h-full items-start justify-start">
            <div className="h-auto w-auto relative flex">
              <Image
                src="/image/ButtonGameBackground.svg"
                width={40}
                height={45}
                alt="Circle Icon"
                className="h-20 w-auto  "
              />
              <div className="font-jaro font-extrabold text-2xl bg-gradient-to-b from-[#FFD400] to-[#C6BF9A] bg-clip-text text-transparent absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2">
                Deposit
              </div>
            </div>
            <div className="h-auto w-auto relative flex">
              <Image
                src="/image/ButtonGameBackground.svg"
                width={40}
                height={45}
                alt="Circle Icon"
                className="h-20 w-auto  "
              />
              <div className="font-jaro font-extrabold text-2xl bg-gradient-to-b from-[#FFD400] to-[#C6BF9A] bg-clip-text text-transparent absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2">
                Withdraw
              </div>
            </div>
            <div className="h-auto w-auto relative flex">
              <Image
                src="/image/ButtonGameBackground.svg"
                width={40}
                height={45}
                alt="Circle Icon"
                className="h-20 w-auto  "
              />
              <div className="font-jaro font-extrabold text-2xl bg-gradient-to-b from-[#FFD400] to-[#C6BF9A] bg-clip-text text-transparent absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2">
                Chat
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default GameSelection;
