import { ethers } from "ethers";

export const getProvider = () => {
  const network =
    process.env.ENVIRONMENT === "local"
      ? ""
      : process.env.ENVIRONMENT === "testnet"
      ? "https://rpc-mumbai.matic.today"
      : "https://polygon-rpc.com/";

  return new ethers.providers.JsonRpcProvider("");
};
