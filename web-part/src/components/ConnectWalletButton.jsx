import React from "react";
import { requestAccount } from "../utils/contractServices";

//钱包连接按钮
function ConnectWalletButton({ setAccount }) {
  const connectWallet = async () => {
    try {
      const account = await requestAccount();
      setAccount(account);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div >
  <button onClick={connectWallet}>Connect Web3 Wallet</button>
  </div>
);
}

export default ConnectWalletButton;
