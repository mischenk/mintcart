import { useRouter } from "next/router";
import { Web3Provider, useConnect, useAddress } from "../context/Web3Context";
import { styled } from "@stitches/react";

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
    <Container>
      <Header>Sell your products and services as NFTs</Header>
      <Button onClick={connectWallet}>Try out mintcart</Button>
    </Container>
  );
};

const Container = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  height: "100vh",
});

const Header = styled("h1", {
  fontSize: "4rem",
  maxWidth: "800px",
  textAlign: "center",
});

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
