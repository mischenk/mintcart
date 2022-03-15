import Link from "next/link";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { styled } from "@stitches/react";

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
        const price = ethers.utils.formatUnits(i.price.toString(), "wei");
        const amount = i.amount.toString();
        return {
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
          <ProductItem>
            <div>Price: {p.price}</div>
            <div>Quantity: {p.amount}</div>
          </ProductItem>
        ))}
      </ProductList>
      <div>
        <Link href="/products/create" passHref>
          <button>Create new product</button>
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
