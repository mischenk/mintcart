import { Web3Provider, useConnect } from "../context/Web3Context";

import Button from "./ui/Button";

const ConnectWallet = () => {
  const connect = useConnect();

  return (
    <Web3Provider>
      <div className="flex items-center justify-center flex-col md:h-96">
        <h2 className="mb-4  text-4xl font-bold max-w-4xl	text-center">
          Connect
        </h2>
        <p className="mb-4  max-w-2xl text-center">
          Connect your wallet to access the Dashboard.
        </p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    </Web3Provider>
  );
};

export default ConnectWallet;
