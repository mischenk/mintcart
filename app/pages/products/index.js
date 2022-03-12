import Link from "next/link";
import Layout from "../../components/Layout";
import { Web3Provider } from "../../context/Web3Context";

const ProductsContent = () => {
  return (
    <div>
      <Link href="/products/create" passHref>
        <button>Create new product</button>
      </Link>
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
