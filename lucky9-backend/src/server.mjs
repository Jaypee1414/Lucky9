import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
  transports: ["websocket", "polling"],
  allowEIO3: true,
})

const games = new Map()
const PLAYERS_REQUIRED = 6

const createDeck = () => {
  const suits = ["♠", "♥", "♦", "♣"]
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  return suits.flatMap((suit) => values.map((value) => ({ suit, value })))
}

const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5)
}

const getCardKey = (card) => {
  return `${card.value}-${card.suit}`
}

const calculateScore = (hand) => {
  const totalScore = hand.reduce((total, card) => {

    const cardValue = card?.value

    if (cardValue === "10") {
      return total // 10 is worth 0 points
    }

    if (cardValue === "A") {
      return total + 1 // Ace is worth 1 point
    }

    if (cardValue >= 2 && cardValue <= 9) {
      return total + cardValue // Numeric cards (2-9) contribute their face value
    }

    return total
  }, 0)

  // Return the remainder when divided by 10
  return totalScore % 10
}

io.on("connection", (socket) => {
  socket.on("join-game", (playerName) => {
    let game = Array.from(games.values()).find((g) => g.players.length < PLAYERS_REQUIRED)

    if (!game) {
      game = {
        id: Date.now().toString(),
        players: [],
        hands: {},
        scores: {},
        banker: null,
        gamePhase: "waiting",
        deck: shuffleDeck(createDeck()),
      }
      games.set(game.id, game)
    }

    game.players.push({
      id: socket.id,
      name: playerName,
      money: 40000,
      hasBet: false,
      isbanker: false,
    })

    socket.join(game.id)

    io.to(game.id).emit("player-joined", {
      players: game.players.map((p) => p.name),
      playersCount: game.players.length,
    })

    if (game.players.length === PLAYERS_REQUIRED) {
      game.gamePhase = "selectBanker"
      io.to(game.id).emit("game-started", { gameId: game.id })
    }
  })
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", {
      message: data.message,
      author: data.author,
      time: new Date().toLocaleTimeString(),
    })
  })
  socket.on("play-again", ({ gameId }) => {
    const game = games.get(gameId);
    if (game) {
      // Reset game state
      game.hands = {};
      game.scores = {};
      game.deck = shuffleDeck(createDeck());
  
      // Reset player bets
      game.players = game.players.map(player => ({
        ...player,
        hasBet: false
      }));
  
      io.to(gameId).emit("play-again", { gameId });
  
      startCountdown(gameId);
    }
  });  

  // note that the player-bet event is emitted from the frontend
  socket.on("player-bet", ({ gameId, playerId, playerBet }) => {
    const game = games.get(gameId) // Get the game by ID
    if (game) {
      // Update the player's state
      game.players = game.players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            money: player.money - playerBet, // Deduct the bet
            hasBet: true,
          }
        }
        return player
      })

      io.to(gameId).emit("update-game-state", { players: game.players })
    }
  })

  // note select banker event is emitted from the frontend
  socket.on("select-banker", ({ gameId, banker }) => {
    const game = games.get(gameId)
    if (game) {
      game.banker = banker
      game.players = game.players.map((player) => ({
        ...player,
        isBanker: player.name === banker,
      }))
      io.to(gameId).emit("game-state", sanitizeGameState(game))
      startCountdown(gameId)
    }
  })

   socket.on('startCountdown', ({ gameId }) => {
    startCountdown(gameId);
  });

  socket.on("draw-card", ({ gameId, player }) => {
    console.log(`Received draw-card event for player ${player} in game ${gameId}`)
    const game = games.get(gameId)
    if (game && game.gamePhase === "drawPhase") {
      console.log(`Game found, phase: ${game.gamePhase}`)
      const playerHand = game.hands[player] || []
      console.log(`Player hand: ${JSON.stringify(playerHand)}, score: ${calculateScore(playerHand)}`)
      if (playerHand.length === 2 && calculateScore(playerHand) < 8) {
        const card = game.deck.pop()
        game.hands[player] = [...playerHand, card]
        game.scores[player] = calculateScore(game.hands[player])
        console.log(`Card drawn: ${JSON.stringify(card)}, new hand: ${JSON.stringify(game.hands[player])}`)
        io.to(gameId).emit("game-state", sanitizeGameState(game))
      } else {
        console.log("Conditions for drawing a card not met")
      }
    } else {
      console.log("Game not found or not in draw phase")
    }
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)
    for (const [gameId, game] of games) {
      const playerIndex = game.players.findIndex((p) => p.id === socket.id)
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1)
        if (game.players.length === 0) {
          games.delete(gameId)
        } else {
          io.to(gameId).emit("player-disconnected", {
            players: game.players.map((p) => p.name),
            playersCount: game.players.length,
          })
        }
        break
      }
    }
  })
})

function dealInitialCards(game) {
  for (const player of game.players) {
    game.hands[player.name] = [game.deck.pop(), game.deck.pop()]
    game.scores[player.name] = calculateScore(game.hands[player.name])
  }
  game.gamePhase = "drawPhase"
}

function sanitizeGameState(game) {
  return {
    players: game.players.map((p) => ({
      id: p.id,
      name: p.name,
      money: p.money,
      hasBet: false,
      isBanker: p.isBanker,
    })),
    hands: game.hands,
    scores: game.scores,
    banker: game.banker,
    gamePhase: game.gamePhase,
  }
}

function startCountdown(gameId) {
  const game = games.get(gameId)
  if (!game) return

  game.countdown = 3 // Starting countdown value in seconds
  game.gamePhase = "countdown"

  const countdownInterval = setInterval(() => {
    if (game.countdown > 0) {
      game.countdown--
      io.to(gameId).emit("countdown", game.countdown)
    } else {
      clearInterval(countdownInterval)
      game.gamePhase = "betting"
      io.to(gameId).emit("game-phase", game.gamePhase)

      setTimeout(() => {
        game.gamePhase = "dealCards"
        io.to(gameId).emit("game-phase", game.gamePhase)
        dealInitialCards(game)
      }, 5000) // 5 seconds for betting phase
    }
  }, 1000)
}


const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

