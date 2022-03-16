import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { styled } from "@stitches/react";

import Layout from "../../components/Layout";
import { getProvider } from "../../utils";
import { Web3Provider, useSigner } from "../../context/Web3Context";

import { productAddress } from "../../../config";
import Product from "../../../artifacts/contracts/Product.sol/Product.json";

const CheckoutContent = ({ product }) => {
  const signer = useSigner();

  const buyProduct = async () => {
    const contract = new ethers.Contract(productAddress, Product.abi, signer);
    const price = ethers.utils.parseUnits(product.price.toString(), "ether");
    const amount = "1";

    console.log();
    const tx = await contract.buy(product.id, amount, {
      value: price,
    });
    await tx.wait();
    location.reload();
  };
  return (
    <div>
      <ProductTitle>{product.title}</ProductTitle>
      <ProductDetails>
        {product.price} ETH ({product.sold}/{product.amount})
      </ProductDetails>
      <button onClick={buyProduct}>Buy</button>
    </div>
  );
};

const ProductTitle = styled("h3", {
  fontSize: "1rem",
});

const ProductDetails = styled("div", {
  fontSize: "0.9rem",
});

const Checkout = (props) => {
  return (
    <Web3Provider>
      <Layout>
        <CheckoutContent {...props} />
      </Layout>
    </Web3Provider>
  );
};

export const getStaticPaths = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(productAddress, Product.abi, provider);
  const data = await contract.fetchProducts();

  const paths = data.map((d) => {
    return { params: { id: d.tokenId.toString() } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { id = "" } = params || {};

  const provider = getProvider();
  const contract = new ethers.Contract(productAddress, Product.abi, provider);
  const data = await contract.fetchProduct(id);

  if (!data) {
    return {};
  }

  const meta = await axios.get(
    `https://ipfs.infura.io/ipfs/${data.metadataHash}`
  );

  if (!meta) {
    return {};
  }

  const title = meta.data.title;
  const price = ethers.utils.formatUnits(data.price.toString(), "ether");
  const amount = data.amount.toString();
  const sold = data.sold.toString();

  return {
    props: {
      product: {
        id,
        title,
        price,
        amount,
        sold,
      },
    },
  };
};

export default Checkout;
