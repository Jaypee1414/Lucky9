// ! DO NOT ANYTHING HERE THANKYOU <3
// TODO : FIX THE POSTION OF THE PLAYER
// TODO : FIX THE TIMER
// TODO : PLAYER POINST
// TODO : PLAYER BET
// TODO : ASYNC RESTART

"use client";
import io from "socket.io-client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import PlayerHand from "../components/PlayerHand";
import BankerSelection from "../components/BankerSelection";
import GameSelection from "../components/GameSelection";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

// Utility functions
const createDeck = () => {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  return suits.flatMap((suit) => values.map((value) => ({ suit, value })));
};

const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const getCardKey = (card) => {
  return `${card.value}-${card.suit}`;
};

const calculateScore = (hand) => {
  const totalScore = hand.reduce((total, card) => {
    if (["J", "Q", "K"].includes(card.value)) {
      return total; // Face cards are worth 0 points
    }

    if (card.value === "10") {
      return total; // 10 is worth 0 points
    }

    if (card.value === "A") {
      return total + 1; // Ace is worth 1 point
    }

    const cardValue = Number(card.value);
    if (cardValue >= 2 && cardValue <= 9) {
      return total + cardValue; // Numeric cards (2-9) contribute their face value
    }

    return total;
  }, 0);

  // Return the remainder when divided by 10
  return totalScore % 10;
};

const determineResults = (players, scores, banker) => {
  const bankerScore = scores[banker];
  const results = {};

  for (const player of players) {
    if (player === banker) {
      results[player] = "tie";
      continue;
    }
    const playerScore = scores[player];
    if (playerScore > bankerScore) {
      results[player] = "win";
    } else if (playerScore < bankerScore) {
      results[player] = "lose";
    } else {
      results[player] = "tie";
    }
  }
  return results;
};

// Main Game Component
export default function Game() {
  const [count, setCount] = useState(3);
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [banker, setBanker] = useState("");
  const [hands, setHands] = useState({});
  const [scores, setScores] = useState({});
  const [gamePhase, setGamePhase] = useState("init");
  const [hasDrawn, setHasDrawn] = useState({});
  const [showAllCards, setShowAllCards] = useState(false);
  const [isValue, setValue] = useState();
  const [isGood, setIsGood] = useState(false);
  const [isBet, setIsbet] = useState(0);
  const [showPlayerHands, setShowPlayerHands] = useState(false); // NOTE Added state variable
  const [showBetMessage, setShowBetMessage] = useState(false); // NOTE Added state for bet message
  const [showResults, setShowResults] = useState(false); // note  Added showResults state

  // note hooks for socket
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [playersCount, setPlayersCount] = useState(0);
  const [isWaiting, setIsWaiting] = useState(true);
  const [gameState, setGameState] = useState(null);

  // NOTE : Static player money
  const [isPlayerCoin, setIsPlayerCoin] = useState(40000);
  const [checkPlayerCoin, setCheckPlayerCoin] = useState(false);
  //note get the search params
  const searchParams = useSearchParams();
  const router = useRouter();

  const deckRef = useRef({
    cards: [],
    drawnCards: new Set(),
  });

  const drawCard = useCallback(() => {
    const currentDeck = deckRef.current;

    for (let i = 0; i < currentDeck.cards.length; i++) {
      const card = currentDeck.cards[i];
      const cardKey = getCardKey(card);

      if (!currentDeck.drawnCards.has(cardKey)) {
        currentDeck.drawnCards.add(cardKey);
        currentDeck.cards = currentDeck.cards.filter((_, index) => index !== i);
        console.log(`Card drawn: ${card.value}${card.suit}`);
        return card;
      }
    }

    console.log("No more cards available to draw");
    return null;
  }, []);

  const dealInitialCards = useCallback(
    (currentPlayers, initialDeck) => {
      console.log("Starting initial deal...");

      // NOTE Reset deck state
      deckRef.current = {
        cards: [...initialDeck],
        drawnCards: new Set(),
      };

      const newHands = {};
      const newScores = {};

      // NOTE First round of cards
      for (const player of currentPlayers) {
        const card = drawCard();
        if (card) {
          newHands[player] = [card];
        }
      }

      // NOTE Second round of cards
      for (const player of currentPlayers) {
        const card = drawCard();
        if (card) {
          newHands[player] = [...(newHands[player] || []), card];
        }
        //NOTE Calculate score after both cards are dealt
        newScores[player] = calculateScore(newHands[player]);
        console.log(`Score calculation for ${player}:`, {
          hand: newHands[player].map((card) => `${card.value}${card.suit}`),
          totalBeforeMod: newScores[player],
          finalScore: newScores[player] % 10,
        });
      }

      //NOTE  Update all state at once
      setHands(newHands);
      setScores(newScores);
      setGamePhase("drawPhase");
      setHasDrawn(
        Object.fromEntries(currentPlayers.map((player) => [player, false]))
      );
    },
    [drawCard]
  );

  const startGame = useCallback(() => {
    if (playerName.trim() && socket) {
      console.log("Joining game with name:", playerName);
      socket.emit("join-game", playerName);
      setGamePhase("waiting");
    }
  }, [playerName, socket]);

  const selectBanker = useCallback(
    (selectedBanker) => {
      if (socket && gameId) {
        socket.emit("select-banker", { gameId, banker: selectedBanker });
      }
    },
    [socket, gameId]
  );

  const drawCardForPlayer = useCallback(
    (player) => {
      if (socket && gameId) {
        socket.emit("draw-card", { gameId, player });
      }
    },
    [socket, gameId]
  );

  useEffect(() => {
    // const newSocket = io("https://lucky9.onrender.com");
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("player-joined", (data) => {
      setPlayersCount(data.playersCount);
      setPlayers(data.players);
      if (data.playersCount < 6) {
        setIsWaiting(true);
      }
    });

    newSocket.on("game-started", (data) => {
      setIsWaiting(false);
      setGamePhase("selectBanker");
      setGameId(data.gameId);
    });

    newSocket.on("game-state", (newGameState) => {
      setGameState(newGameState);
      setHands(newGameState.hands);
      setScores(newGameState.scores);
      setBanker(newGameState.banker);
      // setGamePhase(newGameState.gamePhase)
      setGamePhase("countdown");
    });

    newSocket.on("player-disconnected", (data) => {
      setPlayersCount(data.playersCount);
      setPlayers(data.players);
      if (data.playersCount < 6) {
        setIsWaiting(true);
      }
    });
    newSocket.on("game-reset", ({ newGameId, message }) => {
      // Reset all game state except playersCount
      setGameState(null);
      setIsWaiting(true);
      setGameStarted(false);
      setGamePhase("countdown");
      setCount(0);
      setHands({});
      setIsbet(0);
      setShowAllCards(false);
      setIsGood(false);

      // Re-join with the same player name
      if (playerName) {
        socket.emit("join-game", playerName);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const value = searchParams.get("betAmount");
    setValue(value);
  }, [searchParams]);

  useEffect(() => {
    if (gamePhase === "dealCards") {
      const newDeck = shuffleDeck(createDeck());
      dealInitialCards(players, newDeck);
    }
  }, [gamePhase, players, dealInitialCards]);

  useEffect(() => {
    if (gamePhase === "countdown" && count > 0) {
      const timer = setTimeout(() => {
        setCount((prevCount) => {
          return prevCount - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === "countdown" && count === 0) {
      setShowBetMessage(true);
      setGamePhase("betting");
      setTimeout(() => {
        setShowBetMessage(false);
        setShowPlayerHands(true);
        setGamePhase("dealCards");
      }, 5000);
    }
  }, [count, gamePhase]);

  useEffect(() => {
    let timer;
    if (gamePhase === "drawPhase") {
      timer = setTimeout(() => {
        setGamePhase("results");
        setShowAllCards(true);
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer);
  }, [gamePhase]);

  // note check the if the is end after 5 seconds the automatic Play again
  useEffect(() => {
    let timer;
    if (gamePhase === "results") {
      setShowResults(true);
      timer = setTimeout(() => {
        setShowResults(false);
        PlayAgainSameBanker();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [gamePhase]);

  useEffect(() => {
    let timer;
    if (gamePhase === "results") {
      timer = setTimeout(() => {
        // note this is checking if the player coin is less to the min bet Amount
        if (isPlayerCoin < 2000) {
          //note 2000 is not final
          router.push(`/LuckyNine/Gamebet`);
        }
      }, 10000); // note 10 seconds
    }
    return () => clearTimeout(timer);
  }, [gamePhase, isPlayerCoin, router]);

  if (gamePhase === "dealCards") {
    if (isBet === 0) {
      setIsbet(2000);
      setIsPlayerCoin((prevCoin) => Number(prevCoin) - Number(2000));
    }
  }

  function PlayAgainSameBanker() {
    setGamePhase("countdown");
    setCount(3);
    setHands({});
    setIsbet(0);
    setShowAllCards(false);
    setIsGood(false);
  }

  function SelectNewBanker() {
    setGamePhase("selectNewBanker");
    setHands({});
    setShowAllCards(false);
    setIsbet(0);
    setIsGood(false);
  }

  function SelectQuitGame() {
    router.push(`/LuckyNine/Gamebet`);
  }

  //before the game start pick a banker
  if (gamePhase === "init" || gamePhase === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <h1 className="text-4xl font-bold text-center mb-8">
            C2W PLAY LUCKY9 ALGO BETA TEST
          </h1>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="playerName">Your Name</Label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <Button
                onClick={startGame}
                className="w-full"
                disabled={gamePhase === "waiting"}
              >
                {gamePhase === "waiting"
                  ? "Waiting for players..."
                  : "Start Game"}
              </Button>
              <p className="text-center">Players: {playersCount} / 6</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const isBankerIndex = players.indexOf(banker); // note check banker place always in middle
  const playerIndex = gameState?.players.findIndex((p) => p.id === socket.id); // note get player index
  const currentPlayer = gameState?.players.find((p) => p.id === socket.id); // note get the POV player


  return (
    <div className=" bg-[url('/image/GameBackground.svg')] bg-cover bg-center bg-no-repeat w-auto h-screen relative">
      {/* countdown */}
      <div className="w-screen h-screen absolute flex justify-center items-center pointer-events-none">
        <AnimatePresence>
          {count > 0 && banker && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="w-7/12 h-56 bg-black/30 border border-white rounded-2xl z-30 flex items-center justify-center text-center"
            >
              <h1
                className="bg-gradient-to-b from-[#FFE100] to-[#C2AA9A] text-transparent bg-clip-text font-sansita font-extrabold text-8xl"
                aria-live="assertive"
                role="timer"
              >
                {count}
              </h1>
            </motion.div>
          )}
          {showBetMessage && (
            <motion.div
              key="betMessage"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="w-7/12 h-56 bg-black/30 border border-white rounded-xl absolute z-30 flex items-center justify-center text-center"
            >
              <h1 className="bg-gradient-to-b from-[#FFE100] to-[#C2AA9A] text-transparent bg-clip-text font-sansita font-extrabold text-6xl">
                Start your bet
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isWaiting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">Waiting for players...</h2>
              <p>Players: {playersCount} / 6</p>
              <div className=" space-y-2">
                <Button onClick={SelectQuitGame} className="w-full">
                  Quit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="w-full h-full flex justify-center">
        <div className="w-52">
          <div className="">
            {/* Game Area - Left and Center */}
            <div className="lg:col-span-2 space-y-4">
              {(gamePhase === "selectBanker" ||
                gamePhase === "selectNewBanker") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <BankerSelection players={players} onSelect={selectBanker} />
                </motion.div>
              )}
              {showPlayerHands ||
              gamePhase === "drawPhase" ||
              gamePhase === "results" ||
              gamePhase === "betting" ? (
                <div key={socket.id}>
                  {players?.map((player, index) => (
                    <PlayerHand
                      gamestate={gameState}
                      playerIndex={playerIndex} // note get the player index position
                      socket={socket.id} // note check player socket id
                      currentPlayer={gameState?.players[index]?.id} // note get the current player id
                      isPlayerCoin={isPlayerCoin} // note fix player coin
                      isGood={isGood}
                      setIsGood={setIsGood}
                      gamePhase={gamePhase}
                      bet={isBet}
                      isBankerIndex={isBankerIndex}
                      index={index}
                      key={index}
                      player={player}
                      hand={hands[player] || []}
                      score={scores[player] || 0}
                      isBanker={player === banker}
                      canDraw={
                        (gamePhase === "betting" && player === playerName) ||
                        (player === playerName &&
                          gamePhase === "drawPhase" &&
                          !hasDrawn[player] &&
                          (hands[player] || []).length === 2 &&
                          (scores[player] || 0) < 9)
                      }
                      onDraw={() => drawCardForPlayer(player)}
                      showCards={showAllCards || player === playerName}
                      isBot={player.startsWith("Bot")}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* 
              // NOTE Activity Log and Results - Right Panel 
            */}

            <div className="space-y-4 absolute right-56 w-52 bottom-0 -translate-y-1/2">
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-4" key={socket.id}>
                      <h2 className="text-xl font-bold mb-2">Results</h2>
                      {(() => {
                        const results = determineResults(
                          players,
                          scores,
                          banker
                        );
                        return players.map((player, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-2"
                          >
                            <span className="font-medium">{player}: </span>
                            <span className="mr-2">
                              Score: {scores[player]}
                            </span>
                            {player === banker ? (
                              <span className="text-blue-600">Banker</span>
                            ) : (
                              <span
                                className={
                                  results[player] === "win"
                                    ? "text-green-600"
                                    : results[player] === "lose"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }
                              >
                                {results[player] === "win"
                                  ? "Won"
                                  : results[player] === "lose"
                                  ? "Lost"
                                  : "Tied"}
                              </span>
                            )}
                          </motion.div>
                        ));
                      })()}
                      <div className=" space-y-2">
                        <Button onClick={SelectQuitGame} className="w-full">
                          Quit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <GameSelection
        isPlayerCoin={isPlayerCoin}
        setIsPlayerCoin={setIsPlayerCoin}
        value={isValue}
        bet={setIsbet}
        isBanker={players[0] === banker}
        gamePhase={gamePhase}
        count={count}
        showBetMessage={showBetMessage}
      />
    </div>
  );
}
