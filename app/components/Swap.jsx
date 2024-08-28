"use client";

import React, { useState, useEffect } from "react";
import Info from "./Info";
import { Input, Popover, Radio, Modal, message } from "antd";
import { ArrowDownOutlined, SettingOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { isMetaMaskInstalled } from "../../utils";

const Swap = ({ address, isConnected }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const [metaMaskInstalled, setMetaMaskInstalled] = useState(false);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleSlippageChange = (e) => {
    setSlippage(e.target.value);
  };

  const changeAmount = (e) => {
    setTokenOneAmount(e.target.value);
    if (e.target.value && prices) {
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  };

  const switchTokens = () => {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two.address, one.address);
  };

  const openModal = (asset) => {
    setChangeToken(asset);
    setIsOpen(true);
  };

  const modifyToken = (i) => {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i].address, tokenTwo.address);
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.address, tokenList[i].address);
    }
    setIsOpen(false);
  };

  const fetchPrices = async (one, two) => {
    const response = await axios.get("http://localhost:3000/api/tokenPrice", {
      params: { addressOne: one, addressTwo: two },
    });

    setPrices(response.data);
  };

  const fetchDexSwap = async () => {
    const allowance = await axios.get(
      `https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    );

    if (allowance.data.allowance === "0") {
      const approve = await axios.get(
        `https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}`
      );

      setTxDetails(approve.data);
      console.log("Not approved!");
      return;
    }

    const tx = await axios.get(
      `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${
        tokenOne.address
      }&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(
        tokenOne.decimals + tokenOneAmount.length,
        "0"
      )}&fromAddress=${address}&slippage=${slippage}`
    );

    let decimals = Number(`1E${tokenTwo.decimals}`);
    setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(2));

    setTxDetails(tx.data.tx);
  };

  // GET THE PRICES FROM BACKEND - MORALIS API
  useEffect(() => {
    setMetaMaskInstalled(isMetaMaskInstalled());
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  // TO FIRE sendTransaction() FRO WAGMI-LIB
  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails]);

  // TO SHOW MESSAGE CONTEXT (THE TRANSACTION IS LOADING/PENDING)
  useEffect(() => {
    messageApi.destroy();

    if (isLoading) {
      messageApi.open({
        type: "loading",
        content: "Transaction is pending...",
        duration: 0,
      });
    }
  }, [isLoading]);

  // TO SHOW MESSAGE CONTEXT (THE TRANSACTION IS SUCCESSFUL/FAILED)
  useEffect(() => {
    messageApi.destroy();

    if (isSuccess) {
      messageApi.open({
        type: "success",
        content: "Transaction Successful",
        duration: 1.5,
      });
    } else if (txDetails.to) {
      messageApi.open({
        type: "error",
        content: "Transaction Failed",
        duration: 1.5,
      });
    }
  }, [isSuccess]);

  // SLIPPAGE CONTENT MODAL
  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <div className="flex justify-center">
      {/* MESSAGE API HOLDER */}
      {contextHolder}

      {/* MODIFY/CHANGE SELECTED TOKEN */}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => (
            <div className="tokenChoice" key={i} onClick={() => modifyToken(i)}>
              <img src={e.img} alt={e.ticker} className="tokenLogo" />
              <div className="tokenChoiceNames">
                <div className="tokenName">{e.name}</div>
                <div className="tokenTicker">{e.ticker}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <div className="trade-box mt-40">
        <div className="trade-box-header">
          <h4 className="font-semibold text-xl">Swap</h4>
          {/* SLIPPAGE SETTING */}
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>

        {/* TOKEN AMOUNT INPUT FIELD */}
        <div className="inputs">
          <Input
            className="inputAmount"
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            disabled={!prices}
          />
          <Input
            className="inputAmount"
            placeholder="0"
            value={tokenTwoAmount}
            disabled={true}
          />

          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>

          {/* TOKEN MODIFY BUTTON MODAL TRIGGER */}
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
          </div>

          {/* SWAP BUTTON */}
          <div
            className="swapButton"
            disabled={!tokenOneAmount || !isConnected}
            onClick={fetchDexSwap}
          >
            Swap
          </div>

          <Info
            metaMaskInstalled={metaMaskInstalled}
            isConnected={isConnected}
          />
        </div>
      </div>
    </div>
  );
};

export default Swap;
