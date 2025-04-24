import Lock_ABI from "./Lock_ABI.json"
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers"
import { CONTRACT_ADDRESS } from "./constants"

// Module-level variables to store provider, signer, and contract
let provider
let signer
let contract

// Function to initialize the provider, signer, and contract
const initialize = async () => {
  if (typeof window.ethereum !== "undefined") {
    provider = new BrowserProvider(window.ethereum)
    signer = await provider.getSigner()
    contract = new Contract(CONTRACT_ADDRESS, Lock_ABI, signer)
  } else {
    console.error("Please install MetaMask!")
  }
}

// Initialize once when the module is loaded
initialize()

// Function to request single account
export const requestAccount = async () => {
  try {
    const accounts = await provider.send("eth_requestAccounts", [])
    return accounts[0] // Return the first account
  } catch (error) {
    console.error("Error requesting account:", error.message)
    return null
  }
}
// Function to get contract balance in ETH   调用合约查询合约余额的方法
export const getContractBalanceInETH = async () => {
  const balanceWei = await provider.getBalance(CONTRACT_ADDRESS)
  const balanceEth = formatEther(balanceWei) // Convert Wei to ETH string
  return balanceEth // Convert ETH string to number
}

// Function to deposit funds to the contract  调用合约存钱的方法
export const depositFund = async (depositValue) => {
  const ethValue = parseEther(depositValue)
  const deposit = await contract.deposit({ value: ethValue })
  await deposit.wait()
  console.log("depositFund successful!")
  if (typeof window !== 'undefined') {
    console.log("depositFund重新刷新页面~~~")
    //需要页面刷新前停顿2s 
    setTimeout(() => {
      window.location.reload()
    }, 2000)

  }
}

// Function to withdraw funds from the contract
export const withdrawFund = async () => {
  const balanceInETHBefore = await getContractBalanceInETH()
  console.log("合约当前余额是：", balanceInETHBefore)
  const withdrawTx = await contract.withdraw()
  await withdrawTx.wait()
  const balanceInETHAfter = await getContractBalanceInETH()
  console.log("合约取款之后的当前余额是：", balanceInETHAfter)
  console.log("Withdrawal successful!")
  if (typeof window !== 'undefined') {
    console.log("withdrawFund重新刷新页面~~~")
    //需要页面刷新前停顿2s 
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

}
