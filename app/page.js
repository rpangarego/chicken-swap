"use client";

import Header from "./components/Header";
import Swap from "./components/Swap";

import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  return (
    <div className="container mx-auto">
      <Header connect={connect} isConnected={isConnected} address={address} />

      <Swap isConnected={isConnected} address={address} />
    </div>
  );
}
