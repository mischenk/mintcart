import Link from "next/link";
import { useState, useEffect } from "react";
import { styled } from "@stitches/react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

import Layout from "../../components/Layout";
import Button from "../../components/ui/Button";
import ConnectWallet from "../../components/ConnectWallet";
import {
  useChainId,
  useAddress,
  Web3Provider,
} from "../../context/Web3Context";

const DashboardContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <Loading>
      <TailSpin
        ariaLabel="loading-indicator"
        color="#111"
        width={40}
        height={40}
      />
    </Loading>
  ) : (
    <div>
      <PageTitle>Products</PageTitle>
      {products && products.length ? (
        <ProductTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Sold</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.contract}>
                <td>
                  <a>{p.name}</a>
                </td>
                <td>{p.price} eth</td>
                <td>
                  {p.sold} out of {p.supply}
                </td>
                <td>
                  <Link href={`/${p.seller}/${p.slug}`}>
                    <a target="_blank">View checkout page</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </ProductTable>
      ) : (
        <NoProductsMsg>Create your first product...</NoProductsMsg>
      )}
      <div>
        <Link href="/products/create" passHref>
          <Button>Create New Product</Button>
        </Link>
      </div>
    </div>
  );
};

const PageTitle = styled("h2", {
  margin: "0 0 2rem",
});

const ProductTable = styled("table", {
  marginBottom: "1rem",
  width: "100%",
  tr: {
    display: "flex",
    width: "100%",
    marginBottom: "1rem",
    "&:nth-child(even)": {
      backgroundColor: "#efefef",
    },
  },
  th: {
    padding: "0 1rem 0 0  ",
    flex: "0 0 25%",
    textAlign: "left",
  },
  td: {
    padding: "1rem 1rem  1rem 0",
    flex: "0 0 25%",
  },
});

const Loading = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const NoProductsMsg = styled("div", {
  marginBottom: "2rem",
  fontStyle: "italic",
  fontSize: "0.9rem",
});

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
