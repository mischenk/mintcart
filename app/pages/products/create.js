import { useRouter } from "next/router";
import { styled } from "@stitches/react";
import axios from "axios";

import { ipfsAdd, getTokenUri, getProductFactoryContract } from "../../utils";
import {
  useSigner,
  useAddress,
  Web3Provider,
  useDisplayAddress,
  useChainId,
} from "../../context/Web3Context";
import Layout from "../../components/Layout";

const CreateProductContent = () => {
  const router = useRouter();
  const chainId = useChainId();
  const signer = useSigner();
  const address = useAddress();
  const displayAddress = useDisplayAddress();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const { name, description, slug, price, supply } = ev.target;

    // Save metadata to IPFS
    const ipfsHash = await ipfsAdd(name.value, slug.value, description.value);

    const tokenUri = getTokenUri(ipfsHash);

    // Deploy product contract
    const contract = await getProductFactoryContract(chainId, signer);
    await contract.create(
      tokenUri,
      slug.value,
      address,
      price.value,
      supply.value
    );

    // Save product data to db
    await axios.post("/api/products", {
      contract: contract.address,
      chainId,
      seller: address,
      name: name.value,
      description: description.value,
      slug: slug.value,
      tokenUri,
      price: price.value,
      supply: supply.value,
      sold: 0,
    });

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
        <Label htmlFor="supply">Quantity</Label>
        <Input
          id="supply"
          name="supply"
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
