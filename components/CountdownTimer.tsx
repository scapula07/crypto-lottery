import React,{useState,useEffect} from "react";
import { useAddress, useContract, useContractData } from "@thirdweb-dev/react";
import Countdown from "react-countdown";
import {getSigner} from "../util"
import { ethers } from "ethers";
import abi from "../pages/Lottery2.json"


type CountdownTimerProps = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  completed?: boolean;
};

const CountdownTimer: React.FC<CountdownTimerProps> = () => {
  const [expiration,setExp]=useState<any>()

  useEffect(()=>{
    const getAllParams=async()=>{

       if (window.ethereum) {
         const signer:any =await getSigner()
         const Contract = new ethers.Contract("0xC185DD0639f5FaFc44de367239511244BCA33E67", abi, signer);
           const expiration = await Contract.expiration();
         setExp(expiration)
           
         } else {
               alert("No wallet detected");
         }

     }


     getAllParams()

 },[])

  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownTimerProps) => {
    if (completed) {
      return (
        <div>
          <h2
            className="text-white text-center animate-bounce"
       
          >
            Ticket Sales have now CLOSED for this draw
          </h2>
          <div className="flex space-x-6">
            <div className="flex-1">
              <div className="countdown animate-pulse">{hours}</div>
              <div className="countdown-label">Hours</div>
            </div>

            <div className="flex-1">
              <div className="countdown animate-pulse">{minutes}</div>
              <div className="countdown-label">Minutes</div>
            </div>

            <div className="flex-1">
              <div className="countdown animate-pulse">{seconds}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h3 className="text-white text-sm mb-2 italic">Time Reamaining</h3>
          <div className="flex space-x-6">
            <div className="flex-1">
              <div className="countdown">{hours}</div>
              <div className="countdown-label">Hours</div>
            </div>

            <div className="flex-1">
              <div className="countdown">{minutes}</div>
              <div className="countdown-label">Minutes</div>
            </div>

            <div className="flex-1">
              <div className="countdown">{seconds}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Countdown date={new Date(expiration * 1000)} renderer={renderer} />,
    </div>
  );
};
export default CountdownTimer;
