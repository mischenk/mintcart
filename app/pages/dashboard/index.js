import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

import ConnectWallet from "../../components/ConnectWallet";
import {
  useChainId,
  useAddress,
  Web3Provider,
} from "../../context/Web3Context";

import Layout from "../../components/Layout";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";

const DashboardContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const chainId = useChainId();
  const address = useAddress();

  useEffect(() => {
    if (!chainId || !address) return;

    axios.get(`/api/${chainId}/products/${address}`).then((result) => {
      setProducts(result.data.products);
      setLoading(false);
    });
  }, [chainId, address]);

  if (!address) {
    return <ConnectWallet />;
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <h2 className="mb-8 font-bold text-2xl">Products</h2>
      {products && products.length ? (
        <table className="mb-8 w-full">
          <thead>
            <tr className="flex mb-4">
              <th className="pr-4 basis-1/4 text-left">Name</th>
              <th className="pr-4 basis-1/4 text-left">Price</th>
              <th className="pr-4 basis-1/4 text-left">Sold</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.contract} className="flex border-b border-b-gray-300">
                <td className="py-6 pr-4 basis-1/4">{p.name}</td>
                <td className="py-6 pr-4 basis-1/4">{p.price} eth</td>
                <td className="py-6 pr-4 basis-1/4">
                  {p.sold} out of {p.supply}
                </td>
                <td className="py-4 pr-4 basis-1/4 flex items-center">
                  <Link href={`/${p.seller}/${p.slug}`}>
                    <a target="_blank">View checkout</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mb-8 italic text-sm">Create your first product...</div>
      )}{" "}
      <Link href="/products/create" passHref>
        <Button>Create New Product</Button>
      </Link>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Web3Provider>
      <Layout>
        <DashboardContent />
      </Layout>
    </Web3Provider>
  );
};

export default Dashboard;
