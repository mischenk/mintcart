const { expect } = require("chai");
const { ethers } = require("hardhat");

const ProductArtifact = require("../artifacts/contracts/ProductV2.sol/Product.json");

describe("Product", () => {
  let Product, product, addr1, addr2, addr3, addr4, addr5;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    ProductFactory = await ethers.getContractFactory("ProductFactory");
    productFactory = await ProductFactory.deploy();
  });

  describe("Products", () => {
    it("Should create product", async () => {
      const name = "Test product";
      const baseUri = "https://ipfs.infura.io/ipfs/";
      const slug = "test";
      const seller = owner.address;
      const price = 1;
      const amount = 10;
      await productFactory.create(name, baseUri, slug, seller, price, amount);

      const productAddrs = await productFactory.fetchProducts();
      expect(productAddrs.length).to.equal(1);

      const product = new ethers.Contract(
        productAddrs[0],
        ProductArtifact.abi,
        owner
      );
      expect(await product.name()).to.equal(name);
      expect(await product.baseUri()).to.equal(baseUri);
      expect(await product.slug()).to.equal(slug);
      expect(await product.price()).to.equal(price);
      expect(await product.amount()).to.equal(amount);
    });

    it("Should not create product unless amount > 0", async () => {
      await expect(
        productFactory.create(
          "Test product",
          "https://ipfs.infura.io/ipfs/",
          "test",
          owner.address,
          1,
          0
        )
      ).to.be.revertedWith("Required to mint at least 1 product");
    });

    it("Should fetch all seller products", async () => {
      let products = await productFactory.fetchSellerProducts(addr1.address);
      expect(products.length).to.equal(0);

      // Create product with owner address
      await productFactory.create(
        "Test product",
        "https://ipfs.infura.io/ipfs/",
        "test",
        owner.address,
        1,
        10
      );
      products = await productFactory.fetchSellerProducts(addr1.address);
      expect(products.length).to.equal(0);

      // // Create product with addr1 address
      await productFactory.create(
        "Test product",
        "https://ipfs.infura.io/ipfs/",
        "test",
        addr1.address,
        1,
        10
      );
      products = await productFactory.fetchSellerProducts(addr1.address);
      expect(products.length).to.equal(1);
    });
  });

  describe("Mint product", () => {
    it("Should mint product", async () => {
      await productFactory.create(
        "Test product",
        "https://ipfs.infura.io/ipfs/",
        "test",
        owner.address,
        1,
        10
      );
      const [productAddr] = await productFactory.fetchProducts();
      const product = new ethers.Contract(
        productAddr,
        ProductArtifact.abi,
        owner
      );

      await product.mint(1, "1234");
      const tokenUri = await product.uri(1);
      expect(tokenUri).to.equal("https://ipfs.infura.io/ipfs/1234.json");
    });
  });

  describe("Buy product", () => {
    it("Should buy product", async () => {
      await productFactory.create(
        "Test product",
        "https://ipfs.infura.io/ipfs/",
        "test",
        owner.address,
        1,
        10
      );
      const [productAddr] = await productFactory.fetchProducts();
      const product = new ethers.Contract(
        productAddr,
        ProductArtifact.abi,
        owner
      );
      await product.mint(10, "1234");
      await product.connect(addr1).buy(1, 2, {
        value: 2,
      });
      expect(await product.sold()).to.equal(2);
    });
  });

  it("Should not buy product if msg.value too low", async () => {
    await productFactory.create(
      "Test product",
      "https://ipfs.infura.io/ipfs/",
      "test",
      owner.address,
      1,
      10
    );
    const [productAddr] = await productFactory.fetchProducts();
    const product = new ethers.Contract(
      productAddr,
      ProductArtifact.abi,
      owner
    );
    await product.mint(10, "1234");
    await expect(
      product.connect(addr1).buy(1, 2, {
        value: 1,
      })
    ).to.be.revertedWith("Error, product costs more");
  });

  it("Should not buy product, if insufficient balance", async () => {
    await productFactory.create(
      "Test product",
      "https://ipfs.infura.io/ipfs/",
      "test",
      owner.address,
      1,
      10
    );
    const [productAddr] = await productFactory.fetchProducts();
    const product = new ethers.Contract(
      productAddr,
      ProductArtifact.abi,
      owner
    );
    await product.mint(1, "1234");
    await expect(
      product.connect(addr1).buy(1, 2, {
        value: 2,
      })
    ).to.be.revertedWith("ERC1155: insufficient balance for transfer");
  });
});
