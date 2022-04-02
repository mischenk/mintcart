import { useRouter } from "next/router";
import { Web3Provider, useConnect, useAddress } from "../context/Web3Context";

import Layout from "../components/Layout";
import Button from "../components/ui/Button";

const HomeContent = () => {
  const router = useRouter();
  const connectWallet = useConnect();
  const address = useAddress();

  if (address) {
    router.push("/dashboard");
  }

  return (
    <div className="flex items-center justify-center flex-col h-[calc(100vh-232px)]">
      <h1 className="mb-10 text-7xl font-bold max-w-4xl	text-center">
        Sell your products and services as NFTs
      </h1>
      <p className="mb-8 text-xl max-w-2xl text-center">
        Whether you sell digital products or services online, mintcart is the
        easiest way to start selling them as NFTs.
      </p>
      <Button onClick={connectWallet}>Try out mintcart</Button>
    </div>
  );
};

const Home = () => {
  return (
    <Web3Provider>
      <Layout>
        <HomeContent />
      </Layout>
    </Web3Provider>
  );
};

export default Home;
