"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import CrystalSnowAnimation from "@/app/components/CrystalSnowAnimation";

const Page = () => {
  const [bet, setBet] = useState();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(null);

  const handleButtonClickLive = () => {
    router.push(`/LuckyNine/livegame?betAmount=${bet}`);
  };

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleExit = () => {
    router.push("/"); // Navigate to the home page
  };

  return (
    <div className="h-screen w-full bg-bet-background">
      <header>
        <div className="w-full h-16 bg-header-gradient relative shadow-sm shadow-white">
          <button onClick={() => handleExit}>
            <Image
              src="/image/ExitButton.svg"
              width={40}
              height={45}
              alt="Exit button"
              className="h-16 w-full z-10"
            />
          </button>
        </div>
      </header>
      <main>
        <div className="w-full h-auto p-20 flex justify-center items-center flex-col gap-5 space-y-5">
          {/* text */}
          <div className="flex gap-10 flex-row w-[900px] justify-between items-center ">
            <Image
              src="/image/vipIcon.svg"
              width={40}
              height={45}
              alt="Vip Icon"
              className="h-24 w-auto z-10 "
            />
            <Image
              src="/image/CircleIcon.svg"
              width={40}
              height={45}
              alt="Circle Icon"
              className="h-24 w-auto z-10 "
            />

            <Image
              src="/image/RegularIcon.svg"
              width={40}
              height={45}
              alt="Regular Icon"
              className="h-16 w-auto z-10"
            />
          </div>
          {/* Logo */}
          <div className="w-full flex justify-center ">
            <Image
              src="/image/LuckyIcon.svg"
              width={40}
              height={45}
              alt="Regular Icon"
              className="h-16 w-auto z-10"
            />
          </div>
          {/* Bet */}
          <div className="flex flex-row w-[1000px] justify-center items-center ">
            <div>
              <Image
                onClick={() => {
                  handleClick(0);
                  setBet(100000);
                }}
                src="/image/bet1.svg"
                width={40}
                height={45}
                alt="3 star bet"
                className={`h-60 w-full z-10 cursor-pointer ${
                  activeIndex === 0
                    ? "transform translate-y-[-10px] scale-110"
                    : ""
                }`}
              />
              <button className="w-44 ml-6">
                <Image
                  onClick={handleButtonClickLive}
                  src="/image/gamebetQuickPlay.svg"
                  width={40}
                  height={45}
                  alt="Quick Play Button"
                  className="h-16 w-full z-10 animate-pulse cursor-pointer"
                />
              </button>
            </div>
            <div>
              <Image
                onClick={() => {
                  handleClick(1);
                  setBet(50000);
                }}
                src="/image/bet2.svg"
                width={40}
                height={45}
                alt="3 star bet"
                className={`h-60 w-full z-10 cursor-pointer ${
                  activeIndex === 1
                    ? "transform translate-y-[-10px] scale-110"
                    : ""
                }`}
              />
              <button className="w-44 ml-6">
                <Image
                  onClick={handleButtonClickLive}
                  src="/image/gamebetQuickPlay.svg"
                  width={40}
                  height={45}
                  alt="Quick Play Button"
                  className="h-16 w-full z-10 animate-pulse cursor-pointer"
                />
              </button>
            </div>

            <div>
              <Image
                onClick={() => {
                  handleClick(2);
                  setBet(25000);
                }}
                src="/image/bet3.svg"
                width={40}
                height={45}
                alt="3 star bet"
                className={`h-60 cursor-pointer w-full z-10 ${
                  activeIndex === 2
                    ? "transform translate-y-[-10px] scale-110"
                    : ""
                }`}
              />
              <button className="w-44 ml-6">
                <Image
                  onClick={handleButtonClickLive}
                  src="/image/gamebetQuickPlay.svg"
                  width={40}
                  height={45}
                  alt="Quick Play Button"
                  className="h-16 w-full z-10 animate-pulse cursor-pointer"
                />
              </button>
            </div>

            <Image
              src="/image/gamebetCrown.svg"
              width={40}
              height={45}
              alt="3 star bet"
              className={`h-44 w-full z-10 slow-high-bounce`}
            />

            <div>
              <Image
                onClick={() => {
                  handleClick(3);
                  setBet(20000);
                }}
                src="/image/bet4.svg"
                width={40}
                height={45}
                alt="3 star bet"
                className={`h-60 w-full z-10 cursor-pointer ${
                  activeIndex === 3
                    ? "transform translate-y-[-10px] scale-110"
                    : ""
                }`}
              />
              <button className="w-44 mr-6">
                <Image
                  onClick={handleButtonClickLive}
                  src="/image/gamebetQuickPlay.svg"
                  width={40}
                  height={45}
                  alt="Quick Play Button"
                  className="h-16 w-full z-10 animate-pulse cursor-pointer"
                />
              </button>
            </div>

            <div>
              <Image
                onClick={() => {
                  handleClick(4);
                  setBet(15000);
                }}
                src="/image/bet5.svg"
                width={40}
                height={45}
                alt="3 star bet"
                className={`h-60 w-full z-10  cursor-pointer ${
                  activeIndex === 4
                    ? "transform translate-y-[-10px]  scale-110"
                    : ""
                }`}
              />
              <button className="w-44 mr-6">
                <Image
                  onClick={handleButtonClickLive}
                  src="/image/gamebetQuickPlay.svg"
                  width={40}
                  height={45}
                  alt="Quick Play Button"
                  className="h-16 w-full z-10 animate-pulse  cursor-pointer"
                />
              </button>
            </div>
            <div>
              <Image
                onClick={() => {
                  handleClick(5);
                  setBet(10000);
                }}
                src="/image/bet6.svg"
                width={40}
                height={45}
                alt="3 star bet"
                className={`h-60 w-full z-10  cursor-pointer ${
                  activeIndex === 4
                    ? "transform translate-y-[-10px]  scale-110"
                    : ""
                }`}
              />
              <button className="w-44 mr-6">
                <Image
                  onClick={handleButtonClickLive}
                  src="/image/gamebetQuickPlay.svg"
                  width={40}
                  height={45}
                  alt="Quick Play Button"
                  className="h-16 w-full z-10  animate-pulse cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer></footer>
      <CrystalSnowAnimation />
    </div>
  );
};

export default Page;
