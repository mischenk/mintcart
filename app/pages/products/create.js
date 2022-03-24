import { useRouter } from "next/router";
import { styled } from "@stitches/react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";

import {
  useSigner,
  useAddress,
  Web3Provider,
  useDisplayAddress,
} from "../../context/Web3Context";
import Layout from "../../components/Layout";

import { productFactoryAddress } from "../../../config";
import ProductFactory from "../../../artifacts/contracts/ProductFactory.sol/ProductFactory.json";

const BASE_URI = "https://ipfs.infura.io/ipfs/";
const ipfsClient = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const CreateProductContent = () => {
  const router = useRouter();
  const signer = useSigner();
  const address = useAddress();
  const displayAddress = useDisplayAddress();

  async function uploadToIPFS(name, slug, description) {
    const data = JSON.stringify({
      name,
      slug,
      description,
    });

    try {
      const added = await ipfsClient.add(data);
      return added.path;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const { name, description, slug, price, amount } = ev.target;
    const ipfsHash = await uploadToIPFS(
      name.value,
      slug.value,
      description.value
    );
    const tokenUri = `${BASE_URI}${ipfsHash}`;
    const priceEther = ethers.utils.parseUnits(price.value, "ether");

    const contract = new ethers.Contract(
      productFactoryAddress,
      ProductFactory.abi,
      signer
    );
    const tx = await contract.create(
      tokenUri,
      slug.value,
      address,
      priceEther,
      amount.value
    );
    await tx.wait();

    router.push("/dashboard");
  };

  return (
    <Form onSubmit={onSubmit}>
      <InputGroup>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add a description to your product"
        />
      </InputGroup>
      <InputGroup>
        <Label htmlFor="slug">URL</Label>
        <SlugContainer>
          <div>https://mintcart.xyz/{displayAddress}/</div>
          <Input id="slug" name="slug" type="text" required />
        </SlugContainer>
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

const SlugContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#ccc",
  color: "#555",
  paddingLeft: "0.5rem",
  input: {
    marginLeft: "0.5rem",
  },
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
