import React from "react";
import { formatAddress } from "../../utils";

const Header = ({ address, connect, isConnected }) => {
  return (
    <header className="flex justify-between items-center border-b-4 min-h-20">
      <div className="flex items-center gap-3 ml-5">
        <img src="/chicken_left.jpg" alt="logo" width={60} />
        <span className="text-lg logo-text">Chicken Swap</span>
      </div>
      <div className="mr-5">
        {!isConnected ? (
          <button className="btn-connect" onClick={connect}>
            Connect
          </button>
        ) : (
          <button className="btn-connected">
            <img
              src="/profile_1.png"
              alt="user_profile"
              width={30}
              className="border-4 rounded-full"
            />
            <span>{formatAddress(address)}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
