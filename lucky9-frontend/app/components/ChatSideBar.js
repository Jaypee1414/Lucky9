"use client";

import { useEffect } from "react";
import ChatPanel from "./ChatPanel";

const ChatSideBar = ({ isOpen, onClose, socket, playerIndex, gameId }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-30 "></div>
      <div className="absolute inset-0 overflow-hidden ">
        <div
          className={`absolute inset-0 bg-opacity-75 transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        ></div>
        <section
          className={`absolute inset-y-0 right-0 max-w-full flex transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="h-full w-[500px] flex flex-col bg-gradient-to-b from-[rgba(124,85,75,0.9)] to-[rgba(27,46,54,0.98)] shadow-xl overflow-y-scroll z-20">
              {/* Icon */}
              <div className="">
                <div className="flex items-center gap-2 px-5 justify-end bg-gradient-to-r from-[rgba(173,0,0,1)] to-[rgba(23,33,34,1)] h-16  bg-opacity-70 -z-10 ">
                  <button
                    onClick={onClose}
                    className="text-black hover:text-gray-500 focus:outline-none octagon bg-white p-1 shadow-md focus:text-gray-500 transition ease-in-out duration-150 z-10"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {/* button */}
              <div className="w-full  h-20 flex justify-start items-center px-5 gap-1">
                <button
                  className="relative h-10 px-6 text-white uppercase tracking-tighter font-jaro text-2xl bg-opacity-80 z-10
                  before:absolute before:inset-0 bg-rightBar-Button border border-black font-extraboldbg-gradient-to-b after:from-[#2a1f1f] after:to-[#4a3636]
                  after:opacity-0 
                  shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
                  "
                  style={{
                    WebkitTextStroke: "0.5px black",
                    textStroke: "0.5px black",
                  }}
                >
                  <span className="">lobby</span>
                </button>
              </div>
              <ChatPanel socket={socket} playerIndex={playerIndex} gameId={gameId}/>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatSideBar;
