import { useSigner, Web3Provider } from "../../context/Web3Context";
import { styled } from "@stitches/react";
import { ethers } from "ethers";

import Layout from "../../components/Layout";

const CreateProductContent = () => {
  const onSubmit = async (event) => {
    event.preventDefault();
    const signer = useSigner();
  };

  return (
    <form onSubmit={onSubmit}>
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
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="0"
          placeholder="Quantity"
          required
        />
      </InputGroup>
      <Button type="submit">Create product</Button>
    </form>
  );
};

const CreateProduct = () => {
  return (
    <Web3Provider>
      <Layout pageTitle="Create a product">
        <CreateProductContent />
      </Layout>
    </Web3Provider>
  );
};

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

export default CreateProduct;
