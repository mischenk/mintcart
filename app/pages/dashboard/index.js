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
import ProductsTable from "../../components/ProductsTable";
import OrdersTable from "../../components/OrdersTable";

const DashboardContent = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const chainId = useChainId();
  const address = useAddress();

  useEffect(() => {
    if (!chainId || !address) return;

    Promise.all([
      axios.get(`/api/${chainId}/${address}/products`).then((result) => {
        setProducts(result.data.products);
      }),
      axios.get(`/api/${chainId}/${address}/orders`).then((result) => {
        setOrders(result.data.orders);
      }),
    ]).then(() => setLoading(false));
  }, [chainId, address]);

  if (!address) {
    return <ConnectWallet />;
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <h2 className="mb-8 md:mb-16 font-bold text-2xl">Products</h2>
      <div className="mb-16">
        {products && products.length ? (
          <ProductsTable products={products} />
        ) : (
          <div className="mb-8 italic text-sm">
            Create your first product...
          </div>
        )}

        <Link href="/products/create" passHref>
          <Button>Create New Product</Button>
        </Link>
      </div>

      {orders && orders.length > 0 && (
        <>
          <h2 className="mb-8 md:mb-16 font-bold text-2xl">Orders</h2>

          <OrdersTable orders={orders} />
        </>
      )}
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
