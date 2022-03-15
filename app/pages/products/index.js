import Link from "next/link";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { styled } from "@stitches/react";
import axios from "axios";

import Layout from "../../components/Layout";
import { useSigner, Web3Provider } from "../../context/Web3Context";

import { productAddress } from "../../../config";
import Product from "../../../artifacts/contracts/Product.sol/Product.json";

const ProductsContent = () => {
  const [products, setProducts] = useState([]);
  const signer = useSigner();

  const init = async () => {
    if (!signer) {
      return;
    }

    const product = new ethers.Contract(productAddress, Product.abi, signer);

    const data = await product.fetchProducts();
    const products = await Promise.all(
      data.map(async (i) => {
        const meta = await axios.get(
          `https://ipfs.infura.io/ipfs/${i.metadataHash}`
        );
        const tokenId = i.tokenId;
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const amount = i.amount.toString();
        const title = meta ? meta.data.title : null;
        return {
          tokenId,
          title,
          price,
          amount,
        };
      })
    );

    setProducts(products);
  };

  useEffect(() => init(), [signer]);

  return (
    <div>
      <ProductList>
        {products.map((p) => (
          <ProductItem key={p.tokenId}>
            <ProductTitle>{p.title}</ProductTitle>
            <ProductDetails>
              <div>Price: {p.price} eth</div>
              <div>Quantity: {p.amount}</div>
              <Link href={`/products/${p.tokenId}`}>View</Link>
            </ProductDetails>
          </ProductItem>
        ))}
      </ProductList>
      <div>
        <Link href="/products/create" passHref>
          <button>Create New Product</button>
        </Link>
      </div>
    </div>
  );
};

const ProductList = styled("ul", {
  listStyle: "none",
  padding: 0,
});

const ProductItem = styled("li", {
  marginBottom: "1rem",
});

const ProductTitle = styled("h3", {
  fontSize: "1rem",
});

const ProductDetails = styled("div", {
  fontSize: "0.9rem",
});

const Products = () => {
  return (
    <Web3Provider>
      <Layout pageTitle="Your products">
        <ProductsContent />
      </Layout>
    </Web3Provider>
  );
};

export default Products;
