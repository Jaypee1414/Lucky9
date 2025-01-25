// note dynamic POV
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PlayerCard from "@/app/components/PlayerHandCard";
// Components
const PlayerHand = ({
  playerIndex,
  socket,
  currentPlayer,
  isPlayerCoin,
  isGood,
  setIsGood,
  gamePhase,
  bet,
  index,
  player,
  hand,
  score,
  isBankerIndex,
  canDraw,
  onDraw,
  showCards,
}) => {

  // note  available bet position
  const betPositions = [
    "bottom-32 left-1/2 -translate-x-1/2 z-20", // Main player
    "right-32 top-1/2 -translate-y-1/2 z-20",
    "right-96 top-48 -translate-y-1/2 z-20",
    "top-52 left-1/2 -translate-x-1/2 z-20",
    "left-96 top-48 -translate-y-1/2 z-20",
    "left-32 top-1/2 -translate-y-1/2 z-20",
  ];

  // note position for banker bet Incase
  const BetBankerPosition = "top-52 z-20";

  // //note  the main player
  const playerBanker = socket === currentPlayer;

  // note position for banker
  const BankerPosition = playerBanker
    ? "bottom-0 left-1/2 -translate-x-1/2 z-10"
    : "top-14 left-1/2 -translate-x-1/2";

  // note Available position
  const playerPositions = [
    "right-3 top-1/2 -translate-y-1/2 z-10",
    "right-72 top-36 -translate-y-1/2 z-10",
    playerBanker
      ? "top-20 left-1/2 -translate-x-1/2"
      : "right-3 top-1/2 -translate-y-1/2 z-10",
    "left-72 top-36 -translate-y-1/2 z-10",
    "left-3 top-1/2 -translate-y-1/2 z-10",
    "top-10 left-1/2 -translate-x-1/2 z-10",
  ];

  // note  Get the player position
  const GetPositionPlayer = (index, bankerIndex) => {
    //  note Check if this player is the current player
    if (socket  === currentPlayer) {
      return "bottom-0 left-1/2 -translate-x-1/2 z-10";
    }

    // note Check if this player is the banker
    if (index === bankerIndex) {
      return BankerPosition;
    }

    let positionIndex = index;

    if(index === 0 ){
      positionIndex = index + playerIndex  ;
    }

    if(index > bankerIndex) {
      positionIndex = index - 1 ; 
    }

    return playerPositions[positionIndex];
  };

  // note Get the player bet position
  const GetPositionBet = (index, bankerIndex) => {
    if (socket === currentPlayer) {
      return betPositions[0];
    }

    let adjustedIndex = index;
    if (index > 0) adjustedIndex--;

    if (index === bankerIndex) {
      return BetBankerPosition;
    }

    return betPositions[(adjustedIndex % 5) + 1];
  };

  const handleGoodButton = () => {
    setIsGood(true);
  };

  const position = GetPositionPlayer(index, isBankerIndex); // position player
  const BetPosition = GetPositionBet(index, isBankerIndex); // position Bet
  const isBanker = index === isBankerIndex; // check if the main plaeyr is the banker


  console.log("playerIndex", playerIndex);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isBanker && socket !== currentPlayer && <div className=" absolute  left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/4 mt-10">
        <Image
          src="/image/Deck.svg"
          width={40}
          height={45}
          alt="Card"
          className="h-16 w-full z-10"
        />
      </div> }

      {isBanker && socket === currentPlayer && <div className=" absolute  left-1/2 bottom-1/3 -translate-x-1/4 -translate-y-1/4 ">
        <Image
          src="/image/Deck.svg"
          width={40}
          height={45}
          alt="Card"
          className="h-16 w-full z-10"
        />
      </div> }
      <Card
        className={` absolute flex items-center justify-center ${position} ${
          isBanker ? "bg-black/65" : "bg-black/65"
        } mb-4`}
      >
        {/* Start of Bet Amount */}
        {/* {bet ? (
          <div
            className={`absolute text-white ${BetPosition} bg-black/25 h-auto p-3 w-auto`}
          >
            <div className="w-auto flex flex-col justify-start items-start">
              <div className="font-bold text-sm">Bet Amount</div>
              <div className="flex flex-row justify-center items-center font-jaro font-bold text-xl">
                <Image
                  src="/image/GameCoin.svg"
                  width={40}
                  height={45}
                  alt="Exit button"
                  className="h-5 w-full"
                />
                {bet}
              </div>
            </div>
          </div>
        ) : (
          ""
        )} */}
        {/* End of Bet Amound */}

        <div className="relative">
          <CardContent className="p-2">
            {showCards && (
              <div className="absolute -right-3 -top-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className=" text-white h-auto relative"
                >
                  <Image
                    src="/image/ScoreBackground.svg"
                    width={40}
                    height={45}
                    alt="Exit button"
                    className="h-10 w-full"
                  />
                  <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-extrabold text-[#FFF600] text-stroke-thin font-jaro text-3xl">
                    {score}
                  </div>
                </motion.div>
              </div>
            )}
            <Image
              src="https://static.wikia.nocookie.net/hunterxhunter/images/3/3e/HxH2011_EP147_Gon_Portrait.png/revision/latest?cb=20230904181801"
              width={40}
              height={45}
              alt="Exit button"
              className="w-14 h-auto absolute -top-8 rounded-full -z-10"
            />
            <h3 className="text-xl font-bold mb-2 flex items-center text-white font-jaro mt-4">
              {player}{" "}
              {isBanker && (
                <div className="font-jaro text-lg ml-2  bg-gradient-to-b from-[#FFE100] to-[#C2AA9A] text-transparent bg-clip-text">
                  (Banker)
                </div>
              )}
            </h3>
            <div className="relative">
              { gamePhase === "dealCards" || gamePhase === "drawPhase" || gamePhase === "results" ? <PlayerCard showCards={showCards} hand={hand} /> : ""}
              <div className="text-white flex flex-row w-fullrounded-b-lg bg-black/60 p-1 font-jainiPurva text-2xl justify-center items-center">
                <Image
                  src="/image/GameCoin.svg"
                  width={40}
                  height={45}
                  alt="Circle Icon"
                  className="h-6 w-auto  "
                />
                {isPlayerCoin}
              </div>
            </div>
            {canDraw && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -top-20 flex flex-row w-auto  justify-start gap-1 -left-24"
              >
                <Button
                  onClick={onDraw}
                  disabled={gamePhase === "betting" || isGood}
                  className={` bg-blue-600 rounded-full border-b-2 w-20 hover:bg-blue-800 ${
                    gamePhase === "betting"
                      ? "opacity-65 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Hirit
                </Button>
                <Button
                  onClick={handleGoodButton}
                  disabled={gamePhase === "betting" || isGood}
                  className={`bg-green-600 rounded-full border-b-2 w-20 hover:bg-green-800 ${
                    gamePhase === "betting"
                      ? "opacity-65 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Good
                </Button>
                <Button
                  disabled={gamePhase !== "betting"}
                  className={`bg-yellow-600 rounded-full border-b-2 w-20 hover:bg-yellow-700 cursor-pointer ${
                    gamePhase !== "betting"
                      ? "opacity-65 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Bet
                </Button>
                <Button
                  disabled={gamePhase !== "betting"}
                  className={`bg-yellow-600 rounded-full border-b-2 w-20 hover:bg-yellow-700 cursor-pointer ${
                    gamePhase !== "betting"
                      ? "opacity-65 cursor-not-allowed"
                      : ""
                  }`}
                >
                  All-in
                </Button>
              </motion.div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default PlayerHand;


// note default static POV 
//  note base on index player
// import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Sparkles } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import PlayerCard from "@/app/components/PlayerHandCard";
// // Components
// const PlayerHand = ({
//   socket,
//   currentPlayer,
//   isPlayerCoin,
//   isGood,
//   setIsGood,
//   gamePhase,
//   bet,
//   index,
//   player,
//   hand,
//   score,
//   isBankerIndex,
//   canDraw,
//   onDraw,
//   showCards,
// }) => {

//   //note  the main player
//   const playerBanker = isBankerIndex === 0;

//   // note position for banker
//   const BankerPosition = playerBanker
//     ? "bottom-0 left-1/2 -translate-x-1/2 z-10"
//     : "top-14 left-1/2 -translate-x-1/2";

//   // note Available position
//   const playerPositions = [
//     "right-3 top-1/2 -translate-y-1/2 z-10",
//     "right-72 top-36 -translate-y-1/2 z-10",
//     playerBanker
//       ? "top-20 left-1/2 -translate-x-1/2"
//       : "right-3 top-1/2 -translate-y-1/2 z-10",
//     "left-72 top-36 -translate-y-1/2 z-10",
//     "left-3 top-1/2 -translate-y-1/2 z-10",
//     "top-10 left-1/2 -translate-x-1/2 z-10",
//   ];

//   // note position for banker bet Incase
//   const BetBankerPosition = "top-52 z-20";

//   // note  available bet position
//   const betPositions = [
//     "top-56 -translate-y-1/2 z-10",
//     "top-52 z-20",
//     "-left-32 bottom-0 z-20",
//     "top-52 z-20",
//     "-right-32 bottom-0 z-20",
//   ];

//   // note  Get the player position
//   const GetPositionPlayer = (index, bankerIndex) => {
//     // Check if this player is the current player
//     if (socket === currentPlayer) {
//       return "bottom-0 left-1/2 -translate-x-1/2 z-10";
//     }

//     // Check if this player is the banker
//     if (index === bankerIndex) {
//       return BankerPosition;
//     }

//     // Calculate the position index for non-banker players
//     let positionIndex = index;

//     // If the player's index is greater than the bankerIndex, adjust the position
//     if (index > bankerIndex) {
//       positionIndex = index - 1; // Subtract 1 to account for the banker
//     }

//     // Use modulo to wrap around if necessary (this should be safe now that the positions array has enough slots)
//     return playerPositions[positionIndex % playerPositions.length];
//   };

//   // note Get the player bet position
//   const GetPositionBet = (index, bankerIndex) => {
//     if (index === 0) {
//       return " -top-40";
//     }

//     if (index === bankerIndex) {
//       return BetBankerPosition;
//     }

//     let positionIndex = index;
//     if (index > bankerIndex) {
//       positionIndex = (index - 1) % betPositions.length;
//     }

//     return betPositions[positionIndex];
//   };

//   const handleGoodButton = () =>{
//     setIsGood(true)
//   }

//   const position = GetPositionPlayer(index, isBankerIndex); // position player
//   const BetPosition = GetPositionBet(index, isBankerIndex); // position Bet
//   const isBanker = index === isBankerIndex; // check if the main plaeyr is the banker

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Card
//         className={` absolute flex items-center justify-center ${position} ${
//           isBanker ? "bg-black/65" : "bg-black/65"
//         } mb-4`}
//       >
//         {/* Start of Bet Amount */}
//         {bet ? (
//           <div
//             className={`absolute text-white ${BetPosition} bg-black/25 h-auto p-3 w-auto`}
//           >
//             <div className="w-auto flex flex-col justify-start items-start">
//               <div className="font-bold text-sm">Bet Amount</div>
//               <div className="flex flex-row justify-center items-center font-jaro font-bold text-xl">
//                 <Image
//                   src="/image/GameCoin.svg"
//                   width={40}
//                   height={45}
//                   alt="Exit button"
//                   className="h-5 w-full"
//                 />
//                 {bet}
//               </div>
//             </div>
//           </div>
//         ) : (
//           ""
//         )}
//         {/* End of Bet Amound */}

//         <div className="relative">
//           <CardContent className="p-2">
//             {showCards && (
//               <div className="absolute -right-3 -top-3">
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className=" text-white h-auto relative"
//                 >
//                   <Image
//                     src="/image/ScoreBackground.svg"
//                     width={40}
//                     height={45}
//                     alt="Exit button"
//                     className="h-10 w-full"
//                   />
//                   <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  font-extrabold text-[#FFF600] text-stroke-thin font-jaro text-3xl">
//                     {score}
//                   </div>
//                 </motion.div>
//               </div>
//             )}
//             <Image
//               src="https://static.wikia.nocookie.net/hunterxhunter/images/3/3e/HxH2011_EP147_Gon_Portrait.png/revision/latest?cb=20230904181801"
//               width={40}
//               height={45}
//               alt="Exit button"
//               className="w-14 h-auto absolute -top-8 rounded-full -z-10"
//             />
//             <h3 className="text-xl font-bold mb-2 flex items-center text-white font-jaro mt-4">
//               {player}{" "}
//               {isBanker && (<div className="font-jaro text-lg ml-2  bg-gradient-to-b from-[#FFE100] to-[#C2AA9A] text-transparent bg-clip-text">
//               (Banker)
//             </div>)}
//             </h3>
//             <div className="relative">
//             <PlayerCard showCards={showCards} hand={hand}/>
//             <div className="text-white flex flex-row w-fullrounded-b-lg bg-black/60 p-1 font-jainiPurva text-2xl justify-center items-center">
//             <Image
//                   src="/image/GameCoin.svg"
//                   width={40}
//                   height={45}
//                   alt="Circle Icon"
//                   className="h-6 w-auto  "
//                 />
//               {isPlayerCoin}
//               </div>
//             </div>
//             {canDraw &&  (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="absolute -top-20 flex flex-row w-auto  justify-start gap-1 -left-24"
//               >
//                 <Button
//                   onClick={onDraw}
//                   disabled={gamePhase === "betting" || isGood}
//                   className={` bg-blue-600 rounded-full border-b-2 w-20 hover:bg-blue-800 ${gamePhase === "betting" ?  "opacity-65 cursor-not-allowed" : ""}`}
//                 >
//                   Hirit
//                 </Button>
//                 <Button
//                   onClick={handleGoodButton}
//                   disabled={gamePhase === "betting" || isGood}
//                   className= {`bg-green-600 rounded-full border-b-2 w-20 hover:bg-green-800 ${gamePhase === "betting" ?  "opacity-65 cursor-not-allowed" : ""}`}
//                 >
//                   Good
//                 </Button>
//                 <Button
//                   disabled={gamePhase !== "betting"}
//                   className={`bg-yellow-600 rounded-full border-b-2 w-20 hover:bg-yellow-700 cursor-pointer ${gamePhase !== "betting" ?  "opacity-65 cursor-not-allowed" : ""}`}
//                 >
//                   Bet
//                 </Button>
//                 <Button
//                   disabled={gamePhase !== "betting"}
//                   className={`bg-yellow-600 rounded-full border-b-2 w-20 hover:bg-yellow-700 cursor-pointer ${gamePhase !== "betting" ?  "opacity-65 cursor-not-allowed" : ""}`}
//                 >
//                   All-in
//                 </Button>
//               </motion.div>

//             )}
//           </CardContent>
//         </div>
//       </Card>
//     </motion.div>
//   );
// };

// export default PlayerHand;
