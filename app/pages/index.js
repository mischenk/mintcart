import Layout from "../components/Layout";
import { Web3Provider } from "../context/Web3Context";

const HomeContent = () => {
  return (
    <div>
      <button>Try it out</button>
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
