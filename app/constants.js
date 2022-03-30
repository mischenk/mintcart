import { MUMBAI_ADDRESS } from "./addresses";

const MUMBAI_NETWORK_ID = 0x13881;
const LOCALHOST_NETWORK_ID = 0x539;

export const contractAddressesByNetworkId = {
  [LOCALHOST_NETWORK_ID]: process.env.NEXT_PUBLIC_LOCAL_ADDRESS || "",
  [MUMBAI_NETWORK_ID]: MUMBAI_ADDRESS,
};

export const ipfsBaseUri = "https://ipfs.infura.io/ipfs/";
