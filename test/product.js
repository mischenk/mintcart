const { expect } = require("chai");
const { ethers } = require("hardhat");

const ProductArtifact = require("../artifacts/contracts/ProductV2.sol/Product.json");

describe("Products", () => {
  let Product, product, addr1, addr2, addr3, addr4, addr5;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    ProductFactory = await ethers.getContractFactory("ProductFactory");
    productFactory = await ProductFactory.deploy();
  });

  describe("Create products", () => {
    it("Should create product", async () => {
      const tokenUri = "https://ipfs.infura.io/ipfs/";
      const slug = "test";
      const seller = owner.address;
      const price = 1;
      const supply = 10;
      await productFactory.create(tokenUri, slug, seller, price, supply);

      const productAddrs = await productFactory.fetchProducts();
      expect(productAddrs.length).to.equal(1);

      const product = new ethers.Contract(
        productAddrs[0],
        ProductArtifact.abi,
        owner
      );
      expect(await product.tokenUri()).to.equal(tokenUri);
      expect(await product.price()).to.equal(price);
      expect(await product.supply()).to.equal(supply);
    });

    it("Should not create product unless supply > 0", async () => {
      await expect(
        productFactory.create(
          "https://ipfs.infura.io/ipfs/",
          "test",
          owner.address,
          1,
          0
        )
      ).to.be.revertedWith("Error, supply must be at least 1");
    });

    it("Should fetch all seller products", async () => {
      let products = await productFactory.fetchSellerProducts(addr1.address);
      expect(products.length).to.equal(0);

      // Create product with owner address
      await productFactory.create(
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

  describe("Fetch products", () => {
    it("Should fetch product by seller", async () => {
      await productFactory.create(
        "https://ipfs.infura.io/ipfs/",
        "test1",
        owner.address,
        1,
        10
      );
      products = await productFactory.fetchSellerProducts(owner.address);
      expect(products.length).to.equal(1);
    });

    it("Should fetch product by slug", async () => {
      let product = await productFactory.fetchProductBySlug(
        addr1.address,
        "test"
      );
      expect(product).to.equal("0x0000000000000000000000000000000000000000");

      // Create product with owner address
      await productFactory.create(
        "https://ipfs.infura.io/ipfs/",
        "test1",
        owner.address,
        1,
        10
      );
      products = product = await productFactory.fetchProductBySlug(
        addr1.address,
        "test1"
      );
      expect(product).to.equal("0x0000000000000000000000000000000000000000");

      products = product = await productFactory.fetchProductBySlug(
        owner.address,
        "test"
      );
      expect(product).to.equal("0x0000000000000000000000000000000000000000");

      // // Create product with addr1 address
      await productFactory.create(
        "https://ipfs.infura.io/ipfs/",
        "test",
        addr1.address,
        1,
        10
      );

      product = await productFactory.fetchProductBySlug(addr1.address, "test");
      expect(product).to.not.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });
  });

  describe("Buy product", () => {
    it("Should buy product", async () => {
      await productFactory.create(
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
      await product.connect(addr1).buy(2, {
        value: 2,
      });
      expect(await product.sold()).to.equal(2);
    });
  });

  it("Should not buy product if msg.value too low", async () => {
    await productFactory.create(
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
    await expect(
      product.connect(addr1).buy(2, {
        value: 1,
      })
    ).to.be.revertedWith("Error, product costs more");
  });

  it("Should not buy product, if insufficient supply", async () => {
    await productFactory.create(
      "https://ipfs.infura.io/ipfs/",
      "test",
      owner.address,
      1,
      1
    );
    const [productAddr] = await productFactory.fetchProducts();
    const product = new ethers.Contract(
      productAddr,
      ProductArtifact.abi,
      owner
    );
    await expect(
      product.connect(addr1).buy(2, {
        value: 2,
      })
    ).to.be.revertedWith("Error, amount is higher than available supply");
  });
});
