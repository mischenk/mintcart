import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { styled } from "@stitches/react";

import { getProvider } from "../../utils";
import { Web3Provider, useSigner } from "../../context/Web3Context";

import { productFactoryAddress } from "../../../config";
import ProductFactoryArtifact from "../../../artifacts/contracts/ProductFactory.sol/ProductFactory.json";
import ProductArtifact from "../../../artifacts/contracts/ProductV2.sol/Product.json";

import SimpleLayout from "../../components/SimpleLayout";
import Button from "../../components/ui/Button";

const CheckoutContent = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const signer = useSigner();

  if (!product) {
    return <div>Error: product not found</div>;
  }

  const buyProduct = async (e) => {
    e.preventDefault();

    const contract = new ethers.Contract(
      product.productAddress,
      ProductArtifact.abi,
      signer
    );
    const value = ethers.utils.parseUnits(
      (product.price * quantity).toString(),
      "ether"
    );
    const tx = await contract.buy(quantity, {
      value,
    });
    await tx.wait();
    location.reload();
  };

  return (
    <form>
      <>
        <ProductHeader>
          <div>
            <ProductName>{product.name}</ProductName>
            <ProductSales>
              {product.sold} out of {product.supply} sold.
            </ProductSales>
          </div>
          <ProductPrice>
            {product.price} <span>ETH</span>
          </ProductPrice>
        </ProductHeader>

        {product.description ? (
          <ProductDescription>{product.description}</ProductDescription>
        ) : null}
      </>

      <ContactContainer>
        <input type="email" name="email" placeholder="Email Address" />
        <input type="text" name="name" placeholder="Full Name" />
      </ContactContainer>

      <OrderSummary>
        <TotalLabel>Total</TotalLabel>
        <TotalPrice>
          {quantity ? product.price * quantity : 0} <span>ETH</span>
        </TotalPrice>
      </OrderSummary>

      {product.sold < product.supply ? (
        <PurchaseContainer>
          <QuantityInput
            type="number"
            min={1}
            max={product.supply - product.sold}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <Button style="wide" onClick={buyProduct}>
            Place your order
          </Button>
        </PurchaseContainer>
      ) : (
        <Button disabled>Sold out</Button>
      )}
    </form>
  );
};

const ProductHeader = styled("div", {
  display: "flex",
  marginBottom: "2rem",
  fontSize: "$xxl",
  fontWeight: "$bolder",
});

const ProductName = styled("div", {
  marginBottom: "0.5rem",
  textTransform: "uppercase",
});

const ProductSales = styled("div", {
  fontWeight: "$lighter",
  fontSize: "1rem",
});

const ProductDescription = styled("div", {
  marginBottom: "2rem",
});

const ProductPrice = styled("div", {
  fontWeight: "$bold",
  display: "flex",
  flexGrow: 1,
  justifyContent: "flex-end",
  alignItems: "center",
  fontWeight: "$bold",
  span: {
    marginTop: "2px",
    marginLeft: "3px",
    fontSize: "$base",
    fontWeight: "$light",
  },
});

const ContactContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  marginBottom: "2rem",
  input: {
    marginBottom: "1rem",
    padding: "0.5rem",
    fontSize: "1rem",
    width: "100%",
  },
});

const OrderSummary = styled("div", {
  display: "flex",
  marginBottom: "1rem",
  fontSize: "$xl",
});

const TotalLabel = styled("div", {});

const TotalPrice = styled("div", {
  display: "flex",
  flexGrow: 1,
  justifyContent: "flex-end",
  alignItems: "center",
  fontWeight: "$bold",
  span: {
    marginTop: "2px",
    marginLeft: "3px",
    fontSize: "$sm",
    fontWeight: "$light",
  },
});

const PurchaseContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
});

const QuantityInput = styled("input", {
  width: "100px",
  marginRight: "1rem",
  padding: "0.5rem 0.3rem 0.5rem 1rem",
  textAlign: "center",
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: "black",
  height: "$10",
});

const Checkout = (props) => {
  return (
    <Web3Provider>
      <SimpleLayout>
        <CheckoutContent {...props} />
      </SimpleLayout>
    </Web3Provider>
  );
};

export const getStaticPaths = async () => {
  const provider = getProvider();
  const productFactory = new ethers.Contract(
    productFactoryAddress,
    ProductFactoryArtifact.abi,
    provider
  );
  const productAddrs = await productFactory.fetchProducts();

  const paths = [];

  for (let addr of productAddrs) {
    const product = new ethers.Contract(addr, ProductArtifact.abi, provider);

    const address = await product.owner();
    const tokenUri = await product.tokenUri();
    const meta = await axios.get(tokenUri);
    const { slug } = meta.data;

    paths.push({ params: { address, slug } });
  }

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { address = "", slug = "" } = params || {};

  const provider = getProvider();
  const productFactory = new ethers.Contract(
    productFactoryAddress,
    ProductFactoryArtifact.abi,
    provider.getSigner()
  );
  const productAddress = await productFactory.fetchProductBySlug(
    ethers.utils.getAddress(address),
    slug
  );

  if (!productAddress) {
    return { props: { product: null } };
  }

  const product = new ethers.Contract(
    productAddress,
    ProductArtifact.abi,
    provider.getSigner()
  );

  const tokenUri = await product.tokenUri();
  const meta = await axios.get(tokenUri);

  if (!meta) {
    return { props: { product: null } };
  }

  const { name, description } = meta.data;

  const price = await product.price();
  const supply = await product.supply();
  const sold = await product.sold();

  console.log({
    name,
    description,
    price: parseFloat(ethers.utils.formatUnits(price.toString(), "ether")),
    supply: parseInt(supply.toString()),
    sold: parseInt(sold.toString()),
  });

  return {
    props: {
      product: {
        name,
        productAddress,
        description,
        price: parseFloat(ethers.utils.formatUnits(price.toString(), "ether")),
        supply: parseInt(supply.toString()),
        sold: parseInt(sold.toString()),
      },
    },
  };
};

export default Checkout;
