"use client";
import {
  useAddress,
  useContract,
  useContractCall,
  useContractData,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Login from "../components/Login";
import { currency } from "../constants";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "../components/AdminControls";
import abi from "./Lottery2.json"
import {getSigner,getSender} from "../util"

const Home: NextPage = () => {


  const address = useAddress();
  const [userTicket, setUserTicket] = useState(0);
  const [remainingTickets,setRemaining]=useState<any>()
  const [currentWinningReward,setReward]=useState(0)
  const [ticketCommission,setCommission]=useState(0)
  const [expiration,setExp]=useState<any>()
  const [ticketPrice,setPrice]=useState(0)
  const [lastWinner,setWinner]=useState(0)
  const [lotteryOperator,setOperator]=useState("")
  const [tickets,setTickets]=useState([])
  const [lastWinnerAmount,setAmount]=useState(0)
  const [WithdrawWinnings ,setEarnings]=useState(0)
  const [winners ,setWinners]=useState(0)
  // const [address,setAddress]=useState("")

    useEffect(()=>{
     const getAllParams=async()=>{

        if (window.ethereum && address?.length != undefined) {
       
            const signer:any =await getSigner()
            const sender:any =await getSender()

            console.log(signer,"sihg")
            const Contract = new ethers.Contract("0x4BE4cfd1db4c8dFE73585740a275B2c1dA4ce953", abi, signer);
            const remainingTickets = await Contract.RemainingTickets();
            const reward = await Contract.CurrentWinningReward();
            const commission = await Contract.ticketCommission();
            const expiration = await Contract.expiration();
            const price = await Contract.TicketPrice();
            const tickets = await Contract.getTickets();
            const win = await Contract.getWinningsForAddress(sender);
            // const winings = await Contract.WithdrawWinnings();
            const lastwinner = await Contract.lastWinner();
            const operator= await Contract.lotteryOperator();
            setRemaining(remainingTickets)
            setReward(reward)
            setCommission(commission)
            setExp(expiration)
            setPrice(price)
            setWinner(lastwinner) 
            setTickets(tickets)
            setOperator(operator)
            setAmount(win)
            setWinners(win)


            console.log(win,"tickert")

            
          } else {
                alert("No wallet detected");
          }

      }


      getAllParams()

  })


  console.log(ticketPrice,"price")

  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    console.log(tickets,"t>>>>>>>>>>>>")

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    setUserTicket(noOfUserTickets);
  }, [tickets, address]);

  const handleClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying your Tickets...");

    try {
      const signer:any =await getSigner()
      const Contract = new ethers.Contract("0x4BE4cfd1db4c8dFE73585740a275B2c1dA4ce953", abi, signer);
  
      const data = await Contract.BuyTickets({
        value: ethers.utils.parseEther((
                  Number(ethers.utils.formatEther(ticketPrice)) * quantity
                ).toString()
          ),
          gasLimit: "30000000"
           
            });

   

      toast.success("Tickets purchased successfully!", {
        id: notification,
      });
      console.log(data,"ddd")
    } catch (error) {
      toast.error("Whoops! Something went wrong", {
        id: notification,
      });

      console.error("contract call failure", error);
    }
  };

  const onWithdrawWinning = async () => {
    const notification = toast.loading("Withdrawing Winnings...");

    try {
      const signer:any =await getSigner()
      const Contract = new ethers.Contract("0x4BE4cfd1db4c8dFE73585740a275B2c1dA4ce953", abi, signer);
      const data = await Contract.WithdrawWinnings({gasLimit: "30000000"});

      toast.success("Winning Withdrawn successfully!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops! retry,gas error", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  };

  // if (lotteryOperator?.length ===0) return <Loading />;
  if (!address) return <Login />;


  


  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>CRYPTO LOTTERY</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="icon"
          href="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png"
        />
      </Head>

      <div className="flex-1">
        <Header />
        <Marquee className="bg-[#1b2735] p-5 mb-5" gradient={false} speed={100}>
          <div className="flex space-x-2 mx-10">
            <h4 className="text-white font-bold">
              Last Winner: {lastWinner?.toString()}
            </h4>
            <h4 className="text-white font-bold">
              Previous winnings:{" "}
              {lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}
            </h4>
          </div>
        </Marquee>

        {lotteryOperator === address && (
          <div className="flex justify-center">
            <AdminControls />
          </div>
        )}

        {winners > 0 && (
          <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
            <button
              onClick={onWithdrawWinning}
              className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full"
            >
              <p className="font-bold">Winner Winner Chicken Dinner</p>
              <p>
                Total Winnings: {ethers.utils.formatEther(winners.toString())}
              </p>
              <br />
              <p className="font-semibold">Click Here to Withdraw</p>
            </button>
          </div>
        )}
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
          <div className="stats-container">
            <h1 className="text-5xl text-white font-semibold text-center">
              The Next Drow
            </h1>
            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className="text-sm">Total Pool</h2>
                <p className="text-xl">
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward.toString()
                    )}{" "}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Ticket Remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            {/* Timer */}
            <div className="mt-5 mb-3">
              <CountdownTimer/>
            </div>
          </div>
          <div className="stats-container spacey-2">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white pb-2">
                <h2>Price Per Ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice?.toString())}{" "}
                  {currency}
                </p>
              </div>
              <div className="flex text-white items-center space-x-2 bg-[#91B18] border-[#004337] border p-4">
                <p>TICKET</p>
                <input
                  className="flex w-full bg-transparent text-right outline-none"
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                  <p>Total cost tickets</p>
                  <p>
                    {ticketPrice &&
                      Number(
                        ethers.utils.formatEther(ticketPrice?.toString())
                      ) * quantity}{" "}
                    {currency}
                  </p>
                </div>
                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>Service fees</p>
                  <p>
                    {ticketCommission &&
                      ethers.utils.formatEther(
                        ticketCommission?.toString()
                      )}{" "}
                    {currency}
                  </p>
                </div>
                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>
              <button
                onClick={handleClick}
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainingTickets?.toNumber() === 0
                }
                className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 font-semibold px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-100 disabled:cursor-not-allowed"
              >
                Buy {quantity} Tickets for{" "}
                {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) *
                    quantity}{" "}
                {currency}
              </button>
            </div>
            {userTicket > 0 && (
              <div className="stats">
                <p className="text-lg mb-2">
                  You have {userTicket} Tickets in this draw
                </p>
                <div className="flex max-w-sm flex-warp gap-x-2 gap-y-2">
                  {Array(userTicket)
                    .fill("")
                    .map((_, index) => (
                      <p
                        key={index}
                        className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                      >
                        {index + 1}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ticket box */}
      </div>
    </div>
  );
};

export default Home;
