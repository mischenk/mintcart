import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";

import { contractAddressesByNetworkId, ipfsBaseUri } from "./constants";
import ProductFactoryArtifact from "./artifacts/contracts/ProductFactory.sol/ProductFactory.json";
import ProductArtifact from "./artifacts/contracts/ProductV2.sol/Product.json";

const ipfsClient = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const getProductFactoryContract = async (chainId, signer) => {
  return new ethers.Contract(
    contractAddressesByNetworkId[chainId],
    ProductFactoryArtifact.abi,
    signer
  );
};

export const getProductContract = async (productAddress, signer) => {
  return new ethers.Contract(productAddress, ProductArtifact.abi, signer);
};

export const getProvider = () => {
  const env = process.env.ENVIRONMENT;
  const network =
    env === "local"
      ? ""
      : env === "testnet"
      ? "https://rpc-mumbai.matic.today"
      : "https://polygon-rpc.com/";

  return new ethers.providers.JsonRpcProvider(network);
};

export const getTokenUri = (ipfsHash) => {
  return `${ipfsBaseUri}${ipfsHash}`;
};

export const ipfsAdd = async (name, slug, description) => {
  const data = JSON.stringify({
    name,
    slug,
    description,
  });

  try {
    const added = await ipfsClient.add(data);
    return added.path;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

export const parseEthers = (value) => {
  return ethers.utils.parseUnits(value, "ether");
};
