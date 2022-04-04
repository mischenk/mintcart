import { MUMBAI_ADDRESS, RINKEBY_ADDRESS } from "./artifacts/addresses";

const RINKEBY_NETWORK_ID = 0x4;
const MUMBAI_NETWORK_ID = 0x13881;
const LOCALHOST_NETWORK_ID = 0x539;

export const contractAddressesByNetworkId = {
  [LOCALHOST_NETWORK_ID]: process.env.NEXT_PUBLIC_LOCAL_ADDRESS || "",
  [MUMBAI_NETWORK_ID]: MUMBAI_ADDRESS,
  [RINKEBY_NETWORK_ID]: RINKEBY_ADDRESS,
};

export const ipfsBaseUri = "https://ipfs.infura.io/ipfs/";
