"use client";

import CrystalSnowAnimation from "./CrystalSnowAnimation";
import Image from "next/image";
import { useRouter } from "next/navigation";
const GameMode = ({ setIsFinished }) => {

  const router = useRouter();

  const handleButtonClickLive = () => {
    router.push('/LuckyNine/Gamebet')
  }
  return (
    <div className="w-full h-full relative">
    <div className=" inset-0 flex items-center justify-center z-50 h-[91vh]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8, 14, 129, 0.8) 25%, rgba(37, 79, 100, 0.8) 44%)",
          zIndex: -1, // Send it to the background
        }}
      ></div>
      <div className="left-5 absolute top-5">
        <div className="flex flex-row gap-3">
          <div>
            <button>
              <Image
                src="/image/ContactUs.svg"
                alt="My image"
                width={40} // You need to specify width and height
                height={40} // You need to specify width and height
              />
            </button>
          </div>
          <div>
            <button>
              {" "}
              <Image
                src="/image/Settings.svg"
                alt="My image"
                width={40} // You need to specify width and height
                height={40} // You need to specify width and height
              />
            </button>
          </div>
          <div>
            <button>
              {" "}
              <Image
                src="/image/Question.svg"
                alt="My image"
                width={40} 
                height={40} 
              />
            </button>
          </div>
        </div>
      </div>
      <div className="w-[30rem] text-center">
        <div className="py-10">
          <Image
            src="/image/LoadingImage.svg"
            alt="Gon Portrait"
            className="slow-high-bounce"
            width={500} // You need to specify width and height
            height={500} // You need to specify width and height
          />
        </div>
        <div
          className="justify-between overflow-hidden flex flex-col gap-10 stroke-1 text-white stroke-black font-black text-2xl landing"
          style={{
            WebkitTextStroke: "0.5px black",
            textStroke: "0.5px black", 
          }}
        >
          <div className="w-auto space-y-8">
          <h3 className="bg-clip-text text-transparent bg-text-gradient text-5xl text-stroke-thin font-jaro font-bold">Game Mode</h3>
          <div className="flex flex-row gap-5 justify-center ">
            <div>
            <button onClick={handleButtonClickLive}>
              <p    className="text-2xl font-bold tracking-tight text-transparent text-stroke-thin text-white rounded-full bg-black w-56 py-1 border-b-2 border-red-600">Live Game</p>
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div className="w-screen h-16 relative flex justify-center items-center wood">
      <div
        className="absolute flex flex-row gap-2"
        style={{
          WebkitTextStroke: "0.5px black",
          textStroke: "0.5px black", // Fallback
        }}
      >
        <input type="checkbox" id="acceptTerms" />
        <p className="">Accept Terms and Condition</p>
      </div>
      <Image
        src="/image/FooterWood.svg"
        alt="My image"
        width={100} 
        height={100}
        className="w-full h-auto"
      />
    </div>
    <CrystalSnowAnimation />
  </div>
  );
};

export default GameMode;
