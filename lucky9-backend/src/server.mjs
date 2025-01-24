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

const calculateScore = (hand) => {
  // ... (implement the calculateScore function as in the client-side code)
}

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`)

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
      money: 40000
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

  socket.on("select-banker", ({ gameId, banker }) => {
    const game = games.get(gameId)
    if (game) {
      game.banker = banker
      game.gamePhase = "dealCards"
      dealInitialCards(game)
      io.to(gameId).emit("game-state", sanitizeGameState(game))
    }
  })

  socket.on("draw-card", ({ gameId, player }) => {
    const game = games.get(gameId)
    if (game && game.gamePhase === "drawPhase") {
      const playerHand = game.hands[player] || []
      if (playerHand.length === 2 && calculateScore(playerHand) < 8) {
        const card = game.deck.pop()
        game.hands[player] = [...playerHand, card]
        game.scores[player] = calculateScore(game.hands[player])
        io.to(gameId).emit("game-state", sanitizeGameState(game))
      }
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
        money: p.money,
       id: p.id,
       name: p.name
    })),
    hands: game.hands,
    scores: game.scores,
    banker: game.banker,
    gamePhase: game.gamePhase,
  }
}

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

