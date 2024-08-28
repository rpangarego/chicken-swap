import React from "react";

const Info = ({ metaMaskInstalled, isConnected }) => {
  return (
    <p className="mb-7 text-center">
      {!metaMaskInstalled && !isConnected
        ? "Please install MetaMask wallet first."
        : metaMaskInstalled &&
          !isConnected &&
          "Connect your wallet to use this service."}
    </p>
  );
};

export default Info;
