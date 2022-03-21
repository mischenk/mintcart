import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { styled } from "@stitches/react";

import { getProvider } from "../../utils";
import { Web3Provider, useSigner } from "../../context/Web3Context";
import { productAddress } from "../../../config";
import Product from "../../../artifacts/contracts/Product.sol/Product.json";

import SimpleLayout from "../../components/SimpleLayout";
import Button from "../../components/ui/Button";

const CheckoutContent = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const signer = useSigner();

  if (!product) {
    return <div>Error: product not found</div>;
  }

  const priceFloat = parseFloat(product.price.toString());

  const buyProduct = async (e) => {
    e.preventDefault();

    const contract = new ethers.Contract(productAddress, Product.abi, signer);
    const value = ethers.utils.parseUnits(
      (priceFloat * quantity).toString(),
      "ether"
    );
    const tx = await contract.buy(product.id, quantity, {
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
            <ProductName>{product.title}</ProductName>
            <ProductSales>
              {product.sold} out of {product.amount} sold.
            </ProductSales>
          </div>
          <ProductPrice>
            {priceFloat} <span>ETH</span>
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
          {quantity ? priceFloat * quantity : 0} <span>ETH</span>
        </TotalPrice>
      </OrderSummary>

      {parseInt(product.sold.toString()) <
      parseInt(product.amount.toString()) ? (
        <PurchaseContainer>
          <QuantityInput
            type="number"
            min={1}
            max={product.amount - product.sold}
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
  padding: "0.5rem 1rem",
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
  const contract = new ethers.Contract(productAddress, Product.abi, provider);
  const data = await contract.fetchProducts();

  const paths = data.map((d) => {
    return { params: { address: d.seller, slug: d.slug } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { address = "", slug = "" } = params || {};

  const provider = getProvider();
  const contract = new ethers.Contract(productAddress, Product.abi, provider);
  const data = await contract.fetchProductBySlug(address, slug);

  if (!data) {
    return { props: { product: {} } };
  }

  const { tokenId, metadataHash, price, amount, sold } = data;

  const meta = await axios.get(`https://ipfs.infura.io/ipfs/${metadataHash}`);

  if (!meta) {
    return { props: { product: {} } };
  }

  const { title, description } = meta.data;

  return {
    props: {
      product: {
        id: tokenId.toString(),
        title,
        description,
        price: ethers.utils.formatUnits(price.toString(), "ether"),
        amount: amount.toString(),
        sold: sold.toString(),
      },
    },
  };
};

export default Checkout;
