import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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
import Loading from "../../components/ui/Loading";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { use } from "chai";

const CreateProductContent = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const chainId = useChainId();
  const signer = useSigner();
  const address = useAddress();
  const displayAddress = useDisplayAddress();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setLoading(true);

    const { name, description, slug, price, supply } = ev.target;

    // Save metadata to IPFS
    const ipfsHash = await ipfsAdd(name.value, slug.value, description.value);

    const tokenUri = getTokenUri(ipfsHash);

    // Deploy product contract
    const contract = await getProductFactoryContract(chainId, signer);
    const tx = await contract.create(
      tokenUri,
      slug.value,
      address,
      price.value,
      supply.value
    );

    await tx.wait();

    // Save product data to db
    await axios.post(`/api/${chainId}/products/${address}`, {
      contract: contract.address,
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

  return loading ? (
    <Loading />
  ) : (
    <form className="max-w-3xl" onSubmit={onSubmit}>
      <div className="mb-6 pb-6 border-b border-b-gray-300">
        <div className="mb-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Product name"
            required
          />
        </div>

        <div className="mb-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Add a description to your product"
          />
        </div>
        <div className="mb-1">
          <Label htmlFor="slug">URL</Label>
          <div className="mb-4 pl-2 flex items-center bg-gray-300 text-gray-500 text-sm">
            <div>https://mintcart.xyz/{displayAddress}/</div>
            <Input
              className="mb-0 ml-2 "
              id="slug"
              name="slug"
              type="text"
              required
            />
          </div>
        </div>
        <div className="mb-1">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            placeholder="Price"
            required
          />
        </div>
        <div className="mb-1">
          <Label htmlFor="supply">Supply</Label>
          <Input
            id="supply"
            name="supply"
            type="number"
            min="0"
            placeholder="Supply"
            required
          />
        </div>
      </div>

      <Button type="submit">Create product</Button>
      <Link href="/dashboard">
        <a className="ml-6 text-sms underline">Cancel</a>
      </Link>
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

export default CreateProduct;
