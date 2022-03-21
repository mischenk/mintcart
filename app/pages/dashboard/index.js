import Link from "next/link";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { styled } from "@stitches/react";
import axios from "axios";

import Layout from "../../components/Layout";
import Button from "../../components/ui/Button";
import ConnectWallet from "../../components/ConnectWallet";
import { useSigner, useAddress, Web3Provider } from "../../context/Web3Context";

import { productAddress } from "../../../config";
import Product from "../../../artifacts/contracts/Product.sol/Product.json";

const DashboardContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const signer = useSigner();
  const address = useAddress();

  const init = async () => {
    if (!signer || !address) {
      return;
    }

    const contract = new ethers.Contract(productAddress, Product.abi, signer);

    const data = await contract.fetchSellerProducts(address);
    const products = await Promise.all(
      data.map(async (i) => {
        console.log(i);
        const meta = await axios.get(
          `https://ipfs.infura.io/ipfs/${i.metadataHash}`
        );
        const title = meta ? meta.data.title : null;
        const tokenId = i.tokenId;
        const price = ethers.utils.formatUnits(i.price, "ether");
        const slug = i.slug;
        const amount = i.amount.toNumber();
        const sold = i.sold.toNumber();
        return {
          tokenId,
          title,
          slug,
          price,
          amount,
          sold,
        };
      })
    );

    setProducts(products);
    setLoading(false);
  };

  useEffect(() => init(), [signer, address]);

  if (!address) {
    return <ConnectWallet />;
  }

  return loading ? (
    <Loading>Loading ...</Loading>
  ) : (
    <div>
      <PageTitle>Products</PageTitle>
      {products.length ? (
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
              <tr key={p.tokenId}>
                <td>
                  <Link href={`/products/${p.slug}`} key={p.tokenId}>
                    <a>{p.title}</a>
                  </Link>
                </td>
                <td>{parseFloat(p.price)} eth</td>
                <td>
                  {p.sold == p.amount ? "Sold out!" : `{p.sold}/{p.amount}`}
                </td>
                <td>
                  <Link href={`/${address}/${p.slug}`} key={p.tokenId}>
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
  padding: "1rem 0",
  marginBottom: "2rem",
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
