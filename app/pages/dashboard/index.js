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

import { BsBoxArrowUpRight, BsXCircle } from "react-icons/bs";

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
      <h2 className="mb-8 md:mb-16 font-bold text-2xl">Products</h2>
      {products && products.length ? (
        <table className="mb-8 w-full text-sm text-gray-700">
          <thead>
            <tr className="flex mb-4">
              <th className="pr-4 grow text-left">Name</th>
              <th className="pr-4 w-24 text-center">Price</th>
              <th className="pr-4 w-24 text-center">Sold</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.contract} className="flex border-b border-b-gray-300">
                <td className="py-6 pr-4 grow">{p.name}</td>
                <td className="w-24 py-6 pr-4  text-center">{p.price} eth</td>
                <td className="w-24 py-6 pr-4  text-center">
                  {p.sold}{" "}
                  <span className="hidden sm:inline"> / {p.supply}</span>
                </td>
                <td className="w-24 flex items-center justify-end">
                  <Link href={`/${p.seller}/${p.slug}`}>
                    <a target="_blank" className="mr-4 ">
                      <BsBoxArrowUpRight
                        className="h-4 w-4"
                        title="View checkout page"
                      />
                    </a>
                  </Link>

                  <Link href="">
                    <a>
                      <BsXCircle className="h-4 w-4" title="Delete product" />
                    </a>
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
