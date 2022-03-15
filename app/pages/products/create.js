import { useRouter } from "next/router";
import { styled } from "@stitches/react";
import { ethers } from "ethers";

import { useSigner, Web3Provider } from "../../context/Web3Context";
import Layout from "../../components/Layout";

import { productAddress } from "../../../config";
import Product from "../../../artifacts/contracts/Product.sol/Product.json";

const CreateProductContent = () => {
  const router = useRouter();
  const signer = useSigner();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const price = ev.target.price.value;
    const amount = ev.target.amount.value;

    const contract = new ethers.Contract(productAddress, Product.abi, signer);

    const tx = await contract.createProduct(price, amount);
    await tx.wait();

    router.push("/products");
  };

  return (
    <Form onSubmit={onSubmit}>
      <InputGroup>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Title..."
          required
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description..."
          required
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          placeholder="Price"
          required
        />
      </InputGroup>
      <InputGroup>
        <Label htmlFor="amount">Quantity</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="0"
          placeholder="Quantity"
          required
        />
      </InputGroup>
      <Button type="submit">Create product</Button>
    </Form>
  );
};

const Form = styled("form", {
  maxWidth: "800px",
});

const InputGroup = styled("div", {
  paddingBottom: "1rem",
});

const Label = styled("label", {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "1.1rem",
  fontWeight: 700,
});

const Input = styled("input", {
  padding: "1rem",
  width: "100%",
  fontSize: "1.1rem",
});

const Textarea = styled("textarea", {
  padding: "1rem",
  width: "100%",
  minHeight: "10rem",
  fontSize: "1.1rem",
});

const Button = styled("button", {
  width: "100%",
  padding: "1rem",
  backgroundColor: "white",
  color: "black",
  fontSize: "1rem",
  fontWeight: 700,
  borderWidth: 1,
  borderColor: "black",
  borderRadius: "10px",
  boxShadow: "none",
});

const CreateProduct = () => {
  return (
    <Web3Provider>
      <Layout pageTitle="Create a product">
        <CreateProductContent />
      </Layout>
    </Web3Provider>
  );
};

export default CreateProduct;
