'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Utility functions
const createDeck = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  return suits.flatMap(suit => values.map(value => ({ suit, value })));
};

const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const getCardKey = (card) => {
  return `${card.value}-${card.suit}`;
};

const calculateScore = (hand) => {
  return hand.reduce((total, card) => {
    if (['J', 'Q', 'K'].includes(card.value)) return total;
    if (card.value === 'A') return total + 1;
    return total + parseInt(card.value);
  }, 0) % 10;
};

const determineResults = (players, scores, banker) => {
  const bankerScore = scores[banker];
  const results = {};

  for (const player of players) {
    if (player === banker) {
      results[player] = 'tie';
      continue;
    }
    const playerScore = scores[player];
    if (playerScore > bankerScore) {
      results[player] = 'win';
    } else if (playerScore < bankerScore) {
      results[player] = 'lose';
    } else {
      results[player] = 'tie';
    }
  }
  return results;
};

// Components
const PlayerHand = ({ player, hand, score, isBanker, canDraw, onDraw, showCards, isBot, botNotification }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className={`${isBanker ? 'bg-blue-100' : 'bg-white'} mb-4 overflow-hidden`}>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2 flex items-center">
          {player} {isBanker && <Sparkles className="ml-2 text-yellow-500" />}
        </h3>
        <div className="relative">
          <div className="flex space-x-2 mb-2 overflow-x-auto pb-2">
            <AnimatePresence>
              {hand.map((card, index) => (
                <motion.div
                  key={`${card.suit}-${card.value}-${index}`}
                  initial={{ opacity: 0, rotateY: 180 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 180 }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-14 bg-white border border-gray-300 rounded flex items-center justify-center ${
                    showCards ? '' : 'bg-blue-500'
                  }`}
                >
                  {showCards ? (
                    <span
                      className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}
                    >
                      {card.value}
                      {card.suit}
                    </span>
                  ) : (
                    <span className="text-white">?</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {isBot && botNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 right-0 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded shadow"
            >
              {botNotification}
            </motion.div>
          )}
        </div>
        {showCards && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold"
          >
            Score: {score}
          </motion.p>
        )}
        {canDraw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={onDraw} className="mt-2">
              Draw Card
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

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

// Main Game Component
export default function Game() {
  const [playerName, setPlayerName] = useState('');
  const [numBots, setNumBots] = useState(3);
  const [players, setPlayers] = useState([]);
  const [banker, setBanker] = useState('');
  const [hands, setHands] = useState({});
  const [scores, setScores] = useState({});
  const [gamePhase, setGamePhase] = useState('init');
  const [hasDrawn, setHasDrawn] = useState({});
  const [gameLog, setGameLog] = useState([]);
  const [showAllCards, setShowAllCards] = useState(false);
  const [botNotifications, setBotNotifications] = useState([]);

  const addToLog = useCallback((message) => {
    setGameLog(prev => [message, ...prev]);
  }, []);

  const deckRef = useRef({
    cards: [],
    drawnCards: new Set()
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
    
    console.log('No more cards available to draw');
    return null;
  }, []);

  const dealInitialCards = useCallback((currentPlayers, initialDeck) => {
    console.log('Starting initial deal...');
    
    // Reset deck state
    deckRef.current = {
      cards: [...initialDeck],
      drawnCards: new Set()
    };

    const newHands = {};
    const newScores = {};

    // First round of cards
    for (const player of currentPlayers) {
      const card = drawCard();
      if (card) {
        newHands[player] = [card];
        console.log(`First card for ${player}: ${card.value}${card.suit}`);
        addToLog(`${player} received ${card.value}${card.suit}`);
      }
    }

    // Second round of cards
    for (const player of currentPlayers) {
      const card = drawCard();
      if (card) {
        newHands[player] = [...(newHands[player] || []), card];
        console.log(`Second card for ${player}: ${card.value}${card.suit}`);
        addToLog(`${player} received ${card.value}${card.suit}`);
      }
      // Calculate score after both cards are dealt
      newScores[player] = calculateScore(newHands[player]);
    }

    console.log('Final hands:', newHands);
    
    // Update all state at once
    setHands(newHands);
    setScores(newScores);
    setGamePhase('drawPhase');
    setHasDrawn(Object.fromEntries(currentPlayers.map(player => [player, false])));
  }, [addToLog, drawCard]);

  const startGame = useCallback(() => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (numBots < 3 || numBots > 5) {
      alert('Please select between 3 to 5 bots');
      return;
    }
    const botNames = Array.from({ length: numBots }, (_, i) => `Bot ${i + 1}`);
    setPlayers([playerName, ...botNames]);
    setGamePhase('selectBanker');
    addToLog(`Game started with ${numBots + 1} players (including you)`);
  }, [playerName, numBots, addToLog]);

  const selectBanker = useCallback((selectedBanker) => {
    setBanker(selectedBanker);
    setGamePhase('dealCards');
    addToLog(`${selectedBanker} selected as banker`);
  }, [addToLog]);

  const drawCardForPlayer = useCallback(
    (player) => {
      console.log(`Attempting to draw card for ${player}`);
      setHands((prevHands) => {
        const currentHand = prevHands[player] || [];
        console.log(`Current hand for ${player}:`, currentHand);
        
        if (currentHand.length !== 2) {
          console.log(`Invalid hand size for ${player}: ${currentHand.length}`);
          return prevHands;
        }

        if (hasDrawn[player]) {
          console.log(`${player} has already drawn a card this round.`);
          return prevHands;
        }

        const drawnCard = drawCard();
        
        if (!drawnCard) {
          console.log(`Error: No cards available for ${player} to draw!`);
          return prevHands;
        }

        console.log(`${player} drew ${drawnCard.value}${drawnCard.suit}`);
        addToLog(`${player} drew ${drawnCard.value}${drawnCard.suit}`);

        const newHand = [...currentHand, drawnCard];
        const newScore = calculateScore(newHand);

        setScores((prevScores) => ({
          ...prevScores,
          [player]: newScore
        }));

        setHasDrawn((prev) => ({
          ...prev,
          [player]: true
        }));

        if (player.startsWith("Bot")) {
          setBotNotifications((prev) => [...prev, `${player} drew ${drawnCard.value}${drawnCard.suit}!`]);
          setTimeout(() => {
            setBotNotifications((prev) => prev.filter((notif) => !notif.includes(player)));
          }, 2000);
        }

        return {
          ...prevHands,
          [player]: newHand
        };
      });
    },
    [drawCard, addToLog, hasDrawn]
  );

  useEffect(() => {
    if (gamePhase === 'dealCards') {
      const newDeck = shuffleDeck(createDeck());
      dealInitialCards(players, newDeck);
      addToLog('New round started');
    }
  }, [gamePhase, players, dealInitialCards, addToLog]);

  useEffect(() => {
    if (gamePhase === 'drawPhase') {
      const botPlayers = players.filter((player) => player !== playerName);
      
      const processBotTurns = async () => {
        console.log('Processing bot turns...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        for (const bot of botPlayers) {
          console.log(`Checking ${bot}'s turn...`);
          const botHand = hands[bot] || [];
          const botScore = scores[bot] || 0;
          
          if (botHand.length === 2 && botScore < 8 && !hasDrawn[bot]) {
            console.log(`${bot} is eligible to draw a card.`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            drawCardForPlayer(bot);
          } else {
            console.log(`${bot} is not eligible to draw a card. Hand size: ${botHand.length}, Score: ${botScore}, Has drawn: ${hasDrawn[bot]}`);
          }
        }
      };

      processBotTurns();
    }
  }, [gamePhase, players, playerName, scores, hasDrawn, drawCardForPlayer, hands]);

  if (gamePhase === 'init') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <h1 className="text-4xl font-bold text-center mb-8">C2W PLAY LUCKY9 ALGO BETA TEST</h1>
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
              <div>
                <Label htmlFor="numBots">Number of Bots (3-5)</Label>
                <Input
                  id="numBots"
                  type="number"
                  min={3}
                  max={5}
                  value={numBots}
                  onChange={(e) => setNumBots(Math.max(3, Math.min(5, parseInt(e.target.value) || 3)))}
                />
              </div>
              <Button onClick={startGame} className="w-full">
                Start Game
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
        >
          C2W PLAY LUCKY9 ALGO BETA TEST
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Game Area - Left and Center */}
          <div className="lg:col-span-2 space-y-4">
            {(gamePhase === 'selectBanker' || gamePhase === 'selectNewBanker') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <BankerSelection players={players} onSelect={selectBanker} />
              </motion.div>
            )}
            {(gamePhase === 'drawPhase' || gamePhase === 'results') && (
              <>
                {players.map((player) => (
                  <PlayerHand
                    key={player}
                    player={player}
                    hand={hands[player] || []}
                    score={scores[player] || 0}
                    isBanker={player === banker}
                    canDraw={!hasDrawn[player] && gamePhase === 'drawPhase' && player === playerName && (hands[player] || []).length === 2 && (scores[player] || 0) < 9}
                    onDraw={() => drawCardForPlayer(player)}
                    showCards={showAllCards || player === playerName}
                    isBot={player.startsWith('Bot')}
                    botNotification={botNotifications.find((notif) => notif.includes(player))}
                  />
                ))}
                {gamePhase === 'drawPhase' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={() => {
                        setGamePhase('results');
                        setShowAllCards(true);
                        addToLog('Showing results');
                      }}
                      className="w-full"
                    >
                      Show Results
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Activity Log and Results - Right Panel */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-2">Activity Log</h2>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  <AnimatePresence>
                    {gameLog.map((log, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 5, ease: "easeOut" }} // Slower animation
                        className="text-sm"
                      >
                        {log}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {gamePhase === 'results' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">Results</h2>
                    {(() => {
                      const results = determineResults(players, scores, banker);
                      return players.map((player) => (
                        <motion.div
                          key={player}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-2"
                        >
                          <span className="font-medium">{player}: </span>
                          <span className="mr-2">Score: {scores[player]}</span>
                          {player === banker ? (
                            <span className="text-blue-600">Banker</span>
                          ) : (
                            <span
                              className={
                                results[player] === 'win'
                                  ? 'text-green-600'
                                  : results[player] === 'lose'
                                  ? 'text-red-600'
                                  : 'text-yellow-600'
                              }
                            >
                              {results[player] === 'win'
                                ? 'Won'
                                : results[player] === 'lose'
                                ? 'Lost'
                                : 'Tied'}
                            </span>
                          )}
                        </motion.div>
                      ));
                    })()}
                    <div className="mt-4 space-y-2">
                      <Button 
                        onClick={() => {
                          setGamePhase('selectNewBanker');
                          setShowAllCards(false);
                          addToLog('Selecting new banker');
                        }}
                        className="w-full"
                      >
                        Select New Banker
                      </Button>
                      <Button 
                        onClick={() => {
                          setGamePhase('dealCards');
                          setShowAllCards(false);
                          addToLog('Starting new round with same banker');
                        }}
                        className="w-full"
                      >
                        Play Again (Same Banker)
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
  );
}