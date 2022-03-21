import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const Web3Context = React.createContext({
  address: "",
  displayAddress: "",
  signer: { current: undefined },
  chainId: -1,
  networkId: -1,
  connectWallet: () => Promise.resolve(),
  disconnectWallet: () => Promise.resolve(),
});

export const useAddress = () => useContext(Web3Context).address;
export const useDisplayAddress = () => useContext(Web3Context).displayAddress;
export const useSigner = () => {
  const ctx = useContext(Web3Context);
  return ctx.signer ? ctx.signer.current : undefined;
};
export const useChainId = () => useContext(Web3Context).chainId;
export const useConnect = () => useContext(Web3Context).connectWallet;
export const useDisconnect = () => useContext(Web3Context).disconnectWallet;
export const useNetworkId = () => useContext(Web3Context).networkId;

const providerOptions = {};

export const Web3Provider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [chainId, setChainId] = useState(0);
  const [networkId, setNetworkId] = useState(0);
  const signer = useRef();
  const web3Modal = useRef();

  const switchAccount = useCallback(
    (provider, accounts) => {
      const addr = accounts[0];
      setAddress(addr);
      provider
        .lookupAddress(addr)
        .then((d) => setDisplayAddress(d))
        .catch((error) => {
          setDisplayAddress(`${addr.slice(0, 6)}...${addr.slice(-4)}`);
        });
    },
    [setAddress, setDisplayAddress]
  );

  const connectWallet = useCallback(async () => {
    if (!web3Modal.current) return Promise.resolve();

    const instance = await web3Modal.current.connect();
    const provider = new ethers.providers.Web3Provider(instance);

    if (provider.on) {
      provider.on("close", async () => {
        await web3Modal.current.clearCachedProvider();
      });
      provider.on("accountsChanged", switchAccount);
      provider.on("chainChanged", async (chainId) => {
        const networkId = await ethers.providers.getNetwork(Number(chainId));
        setNetworkId(networkId);
        setChainId(Number(chainId));
        window.location.reload();
      });
      provider.on("networkChanged", async (networkId) => {
        const chainId = await ethers.providers.getNetwork(networkId);
        setChainId(chainId);
        setNetworkId(Number(networkId));
        window.location.reload();
      });
    }

    signer.current = provider.getSigner();

    const accounts = await provider.listAccounts();
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    setChainId(chainId);
    setNetworkId(network);
    switchAccount(provider, accounts);

    return web3Modal.current;
  }, [setChainId, setNetworkId, switchAccount]);

  const disconnectWallet = useCallback(async () => {
    await web3Modal.current.clearCachedProvider();
    window.location.reload();
  }, []);

  useEffect(() => {
    web3Modal.current = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });
    if (web3Modal.current.cachedProvider) {
      connectWallet();
    }
  }, [connectWallet, web3Modal]);

  return (
    <Web3Context.Provider
      value={{
        address,
        signer,
        chainId,
        connectWallet,
        networkId,
        displayAddress,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
