import { styled } from "@stitches/react";

import { Web3Provider } from "../context/Web3Context";

import Layout from "../components/Layout";

const HomeContent = () => {
  return <div />;
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
