import Link from "next/link";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

import Layout from "../../components/Layout";
import { useSigner, Web3Provider } from "../../context/Web3Context";

import { productFactoryAddress } from "../../../config";
import ProductFactory from "../../../artifacts/contracts/ProductFactory.sol/ProductFactory.json";

const ProductsContent = () => {
  const [products, setProducts] = useState([]);
  const signer = useSigner();

  const init = async () => {
    if (!signer) {
      return;
    }

    const productFactory = new ethers.Contract(
      productFactoryAddress,
      ProductFactory.abi,
      signer
    );

    const data = await productFactory.fetchProducts();
    console.log("data", data);
    const products = await Promise.all(
      data.map(async (i) => {
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        return {
          price,
        };
      })
    );

    setProducts(products);
  };

  useEffect(() => init(), [signer]);

  return (
    <div>
      <ul>{products.map((p) => p.price)}</ul>
      <div>
        <Link href="/products/create" passHref>
          <button>Create new product</button>
        </Link>
      </div>
    </div>
  );
};

const Products = () => {
  return (
    <Web3Provider>
      <Layout pageTitle="Products">
        <ProductsContent />
      </Layout>
    </Web3Provider>
  );
};

export default Products;
