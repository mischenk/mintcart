const MAINNET_NETWORK_ID = 0x1;
const KOVAN_NETWORK_ID = 0x2a;
const ROPSTEN_NETWORK_ID = 0x3;
const RINKEBY_NETWORK_ID = 0x4;
const GOERLI_NETWORK_ID = 0x5;
const LOCALHOST_NETWORK_ID = 0x539; //0x7a69;

export const networkNameById = {
  [LOCALHOST_NETWORK_ID]: "localhost",
  [KOVAN_NETWORK_ID]: "kovan",
  [ROPSTEN_NETWORK_ID]: "ropsten",
  [MAINNET_NETWORK_ID]: "ethereum",
  [RINKEBY_NETWORK_ID]: "rinkeby",
  [GOERLI_NETWORK_ID]: "goerly",
};
