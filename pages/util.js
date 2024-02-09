import { ethers } from "ethers";

export const getSigner=async()=>{
    const provider = new ethers.providers.Web3Provider(globalThis?.window.ethereum);
    window.ethereum.enable()  // A connection to the Ethereum network
    var signer = await provider.getSigner(); // Holds your private key and can sign things
    var sender = await signer.getAddress();


    return signer
}


export const getSender=async()=>{
    const provider = new ethers.providers.Web3Provider(globalThis?.window.ethereum); 
    window.ethereum.enable()  // A connection to the Ethereum network
    var signer = await provider.getSigner(); // Holds your private key and can sign things
    var sender = await signer.getAddress();


    return sender
}