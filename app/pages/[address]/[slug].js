import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { styled } from "@stitches/react";
import axios from "axios";
import { ethers } from "ethers";

import { getProductFactoryContract, getProductContract } from "../../utils";
import {
  Web3Provider,
  useSigner,
  useChainId,
  useAddress,
} from "../../context/Web3Context";

import SimpleLayout from "../../components/SimpleLayout";
import Button from "../../components/ui/Button";

const CheckoutContent = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const chainId = useChainId();
  const signer = useSigner();
  const router = useRouter();

  const { address, slug } = router.query;

  useEffect(() => {
    if (!chainId || !address || !slug) return;

    axios.get(`/api/${chainId}/products/${address}/${slug}`).then((result) => {
      setProduct(result.data.product);
      setLoading(false);
    });
  }, [chainId, address, slug]);

  const buyProduct = async () => {
    const contract = await getProductContract(address, signer);
    const value = ethers.utils.parseUnits(
      (product.price * quantity).toString(),
      "ether"
    );
    const tx = await contract.buy(quantity, {
      value,
    });
    await tx.wait();

    await axios.post(`/api/buy/${address}/${slug}`);
  };

  if (!product && !loading) {
    return <div>Error: product not found</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const placeOrder = async (e) => {
    e.preventDefault();

    await buyProduct();
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
          <Button style="wide" onClick={placeOrder}>
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

export default Checkout;
