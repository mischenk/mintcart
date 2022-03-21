import { styled } from "@stitches/react";
import { Web3Provider, useConnect } from "../context/Web3Context";

import Button from "./ui/Button";

const ConnectWallet = () => {
  const connect = useConnect();

  return (
    <Web3Provider>
      <Container>
        <>
          <h2>Connect</h2>
          <p>Connect your wallet to access the Dashboard.</p>
          <Button onClick={connect}>Connect Wallet</Button>
        </>
      </Container>
    </Web3Provider>
  );
};

const Container = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  height: "100vh",
});

export default ConnectWallet;
