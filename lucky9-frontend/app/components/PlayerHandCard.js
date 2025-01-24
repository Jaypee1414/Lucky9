import React from "react";
import { AnimatePresence, motion } from "framer-motion";
function PlayerCard({ showCards, hand }) {
  return (
    <div>
      <div className="flex space-x-2 mb-2 overflow-x-auto h-16 w-auto min-w-32">
        <AnimatePresence>
          {hand.map((card, index) => (
            <motion.div
              key={`${card.suit}-${card.value}-${index}`}
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: showCards ? 0 : 180 }}
              exit={{ opacity: 0, rotateY: 180 }}
              transition={{ duration: 0.6 }}
              className={`w-12 h-auto border border-gray-300 rounded flex items-center justify-center ${
                !showCards
                  ? "bg-[url('/image/BackCard.svg')] bg-cover bg-center"
                  : "bg-white"
              }`}
            >
              {showCards ? (
                <span
                  className={`flex flex-col w-full items-center ${card.suit === "♥" || card.suit === "♦"
                    ? "text-red-500"
                    : "text-black"}
                  `}
                >
                  <div className="text-start w-full text-lg px-1 font-jaro">{card.value}</div>
                  <div className="text-4xl font-jaro font-bold">{card.suit}</div>
                </span>
              ) : (
                ""
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PlayerCard;
