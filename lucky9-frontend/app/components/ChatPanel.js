import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"

function ChatPanel({ socket, playerIndex, gameId }) {
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Listen for incoming messages
    const handleReceiveMessage = (data) => {
      console.log("Received message:", data) // Debug log
      setMessages((prev) => [...prev, data])
    }

    socket.on("receive_message", handleReceiveMessage)

    // Cleanup listener on unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage)
    }
  }, [socket])

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom]) // Added scrollToBottom to dependencies

  const sendMessage = (e) => {
    e.preventDefault()

    if (currentMessage.trim()) {
      const messageData = {
        room: gameId, 
        message: currentMessage,
        author: `Player ${playerIndex}`,
        time: new Date().toLocaleTimeString(),
      }

      console.log("Sending message:", messageData) // Debug log

      socket.emit("send_message", messageData)

      // Add message to local state
      setMessages((prev) => [...prev, messageData])

      setCurrentMessage("")
    }
  }

  console.log(messages)

  return (
    <div className="h-full w-full bg-gray-800/10 flex flex-col px-5">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] rounded-lg p-2 ${
              msg.author === `Player ${playerIndex}` ? "ml-auto bg-blue-600 text-white" : "bg-gray-700 text-white"
            }`}
          >
            <div className="text-sm">{msg.message}</div>
            <div className="text-xs opacity-75">
              {msg.author} • {msg.time}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export default ChatPanel

