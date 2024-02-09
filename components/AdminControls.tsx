import React from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowUturnDownIcon,
} from "@heroicons/react/24/solid";
import {
  useContract,
  useContractCall,
  useContractData,
} from "@thirdweb-dev/react";
import { useEffect,useState } from "react";
import { ethers } from "ethers";
import { currency } from "../constants";
import toast from "react-hot-toast";
import abi from "../pages/Lottery.json"
import {getSigner} from "../util"


type AdminControlsProps = {};

const AdminControls: React.FC<AdminControlsProps> = () => {

    const [operatorTotalCommission,setCommission]=useState<any>()
    const [expiration,setExp]=useState<any>()

  useEffect(()=>{
    const getAllParams=async()=>{

       if (window.ethereum) {
        const signer:any =await getSigner()
           const Contract = new ethers.Contract("0x413d77F4f1213Fa38a604406D43eC662038828F4", abi?.abi, signer);
           const totalCommission = await Contract.operatorTotalCommission();
           const expiration = await Contract.expiration();
           console.log(totalCommission,"cooo")
           setCommission(totalCommission)
           setExp(expiration)
           
         } else {
               alert("No wallet detected");
         }

     }


     getAllParams()

 })



  const drawWinner = async () => {
    const notification = toast.loading("Picking a Lucky Winner...");

    try {
      const signer:any =await getSigner()
      const Contract = new ethers.Contract("0x413d77F4f1213Fa38a604406D43eC662038828F4", abi?.abi, signer);
      const data= await Contract.DrawWinnerTicket();

      toast.success("A winner has been selected!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops! Something went wrong", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  };

  const onRefundAll = async () => {
    const notification = toast.loading("Refund All...");

    try {
      const signer:any =await getSigner()
      const Contract = new ethers.Contract("0x413d77F4f1213Fa38a604406D43eC662038828F4", abi?.abi, signer);
      const data= await Contract.RefundAll();

      toast.success("Refunding all tickets holder!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops! Something went wrong", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  };

  const onWithdrawCommission = async () => {
    const notification = toast.loading("Withdrawing Commission...");

    try {
      const signer:any =await getSigner()

      const Contract = new ethers.Contract("0x413d77F4f1213Fa38a604406D43eC662038828F4", abi?.abi, signer);
      const data= await Contract.WithdrawCommission();


      toast.success("Your commission has been withdrawn successfully", {
        id: notification,
      });

    } catch (error) {
      toast.error("Whoops! Something went wrong", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  };

  const onRestartDraw = async () => {
    const notification = toast.loading("Restarting Draw...");

    try {
      const signer:any =await getSigner()
      const Contract = new ethers.Contract("0x413d77F4f1213Fa38a604406D43eC662038828F4", abi?.abi, signer);
      const data= await Contract.restartDraw();
      toast.success("Restarting successfully", {
        id: notification,
      });
      console.info(data);
    } catch (error) {
      toast.error("Whoops! Something went wrong", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  };

  return (
    <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border">
      <h2 className="font-bold">Admin Controls</h2>
      <p className="mb-5">
        Total Commission to be Withdrawn:{" "}
        {operatorTotalCommission &&
          ethers.utils.formatEther(operatorTotalCommission?.toString())}{" "}
        {currency}
      </p>
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0">
        <button onClick={drawWinner} className="adminButton">
          <StarIcon className="h-6 mx-auto mb-2" />
          Draw Winner
        </button>
        <button onClick={onWithdrawCommission} className="adminButton">
          <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
          Withdraw Commission
        </button>
        <button onClick={onRestartDraw} className="adminButton">
          <ArrowPathIcon className="h-6 mx-auto mb-2" />
          Restart Draw
        </button>
        <button onClick={onRefundAll} className="adminButton">
          <ArrowPathIcon className="h-6 mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  );
};
export default AdminControls;
