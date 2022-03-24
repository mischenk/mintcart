import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";

import { contractAddressesByNetworkId } from "./constants";
import ProductFactoryArtifact from "../artifacts/contracts/ProductFactory.sol/ProductFactory.json";
import ProductArtifact from "../artifacts/contracts/ProductV2.sol/Product.json";

const BASE_URI = "https://ipfs.infura.io/ipfs/";
const ipfsClient = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const getProductFactoryContract = async (chainId, signer) => {
  return new ethers.Contract(
    contractAddressesByNetworkId[chainId],
    ProductFactoryArtifact.abi,
    signer
  );
};

const getProductContract = async (productAddress, signer) => {
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

export const getSellerProducts = async (chainId, signer, seller) => {
  if (!chainId || !signer || !seller) return [];

  const productFactory = await getProductFactoryContract(chainId, signer);
  const productAddrs = await productFactory.fetchSellerProducts(seller);

  return Promise.all(
    productAddrs.map(async (address) => {
      const product = new ethers.Contract(address, ProductArtifact.abi, signer);

      const tokenUri = await product.tokenUri();
      const meta = await axios.get(tokenUri);
      const { name, slug } = meta.data;

      return {
        address,
        name,
        slug,
        price: ethers.utils.formatUnits(await product.price(), "ether"),
        supply: (await product.supply()).toNumber(),
        sold: (await product.sold()).toNumber(),
      };
    })
  );
};

export const getProductBySlug = async (chainId, signer, seller, slug) => {
  if (!chainId || !signer) return;

  const productFactory = await getProductFactoryContract(chainId, signer);
  const productAddress = await productFactory.fetchProductBySlug(seller, slug);

  if (!productAddress) {
    return;
  }

  const product = await getProductContract(productAddress, signer);
  const tokenUri = await product.tokenUri();
  const meta = await axios.get(tokenUri);

  if (!meta) {
    return;
  }

  const { name, description } = meta.data;

  const price = await product.price();
  const supply = await product.supply();
  const sold = await product.sold();

  return {
    name,
    description,
    price: parseFloat(ethers.utils.formatUnits(price.toString(), "ether")),
    supply: parseInt(supply.toString()),
    sold: parseInt(sold.toString()),
  };
};

async function uploadToIPFS(name, slug, description) {
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
}

export const createProduct = async (
  chainId,
  signer,
  address,
  price,
  name,
  slug,
  description,
  supply
) => {
  const ipfsHash = await uploadToIPFS(name, slug, description);
  const tokenUri = `${BASE_URI}${ipfsHash}`;
  console.log(price);
  const priceEther = ethers.utils.parseUnits(price, "ether");

  const contract = getFactoryContract(chainId, signer);

  const tx = await contract.create(tokenUri, slug, address, priceEther, supply);
  await tx.wait();
};

export const buyProduct = async (chainId, signer) => {
  const productFactory = await getProductFactoryContract(chainId, signer);
  const value = ethers.utils.parseUnits(
    (product.price * quantity).toString(),
    "ether"
  );
  const tx = await contract.buy(quantity, {
    value,
  });
  await tx.wait();
  s;
};
