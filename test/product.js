const { expect } = require("chai");
const { ethers } = require("hardhat");

const ProductArtifact = require("../app/artifacts/contracts/Product.sol/Product.json");

describe("Products", () => {
  let productFactory,
    profitSharingToken,
    owner,
    addr1,
    addr2,
    addr3,
    addr4,
    addr5;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const ProfitSharingToken = await ethers.getContractFactory(
      "ProfitSharingToken"
    );
    profitSharingToken = await ProfitSharingToken.deploy(1, 1);

    await profitSharingToken.deployed();

    const ProductFactory = await ethers.getContractFactory("ProductFactory");
    productFactory = await ProductFactory.deploy(profitSharingToken.address);

    await productFactory.deployed();
  });

  describe("Create products", () => {
    it("Should create product", async () => {
      const tokenUri = "https://ipfs.infura.io/ipfs/";
      const slug = "test";
      const seller = owner.address;
      const price = ethers.utils.parseEther("1");
      const supply = 10;
      await productFactory.create(tokenUri, slug, seller, price, supply);

      const productAddrs = await productFactory.fetchProducts();
      expect(productAddrs.length).to.equal(1);

      const product = new ethers.Contract(
        productAddrs[0],
        ProductArtifact.abi,
        owner
      );
      [_tokenUri, _seller, _price, _supply] = await product.get();
      expect(_tokenUri).to.equal(tokenUri);
      expect(_price).to.equal(price);
      expect(_supply).to.equal(supply);
    });

    it("Should not create product unless supply > 0", async () => {
      await expect(
        productFactory.create(
          "https://ipfs.infura.io/ipfs/",
          "test",
          owner.address,
          ethers.utils.parseEther("1"),
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
        ethers.utils.parseEther("1"),
        10
      );
      products = await productFactory.fetchSellerProducts(addr1.address);
      expect(products.length).to.equal(0);

      // // Create product with addr1 address
      await productFactory.create(
        "https://ipfs.infura.io/ipfs/",
        "test",
        addr1.address,
        ethers.utils.parseEther("1"),
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
        ethers.utils.parseEther("1"),
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
        ethers.utils.parseEther("1"),
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
        ethers.utils.parseEther("1"),
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
        ethers.utils.parseEther("1"),
        10
      );
      const [productAddr] = await productFactory.fetchProducts();
      const product = new ethers.Contract(
        productAddr,
        ProductArtifact.abi,
        owner
      );
      await product.connect(addr1).buy(2, {
        value: ethers.utils.parseEther("2"),
      });
      const [tokenUri, seller, price, supply, sold] = await product.get();
      expect(sold).to.equal(2);
    });
  });

  it("Should not buy product if msg.value too low", async () => {
    await productFactory.create(
      "https://ipfs.infura.io/ipfs/",
      "test",
      owner.address,
      ethers.utils.parseEther("1"),
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
        value: ethers.utils.parseEther("1"),
      })
    ).to.be.revertedWith("Error, product costs more");
  });

  it("Should not buy product, if insufficient supply", async () => {
    await productFactory.create(
      "https://ipfs.infura.io/ipfs/",
      "test",
      owner.address,
      ethers.utils.parseEther("1"),
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
        value: ethers.utils.parseEther("2"),
      })
    ).to.be.revertedWith("Error, amount is higher than available supply");
  });

  it("It should split profits", async () => {
    await productFactory.create(
      "https://ipfs.infura.io/ipfs/",
      "test",
      addr1.address,
      ethers.utils.parseEther("100"),
      10
    );

    const [productAddr] = await productFactory.connect(addr1).fetchProducts();
    const product = new ethers.Contract(
      productAddr,
      ProductArtifact.abi,
      addr2
    );

    [tokenUri, seller, price, supply, sold, fee] = await product.get();
    expect(fee).to.equal(ethers.utils.parseEther("5"));

    const initialBalance = await ethers.provider.getBalance(addr1.address);

    await product.connect(addr2).buy(1, {
      value: ethers.utils.parseEther("100"),
    });

    const profit = await profitSharingToken.profitBalanceOf(owner.address);
    expect(profit).to.equal(ethers.utils.parseEther("5"));

    const balanceAfter = await ethers.provider.getBalance(addr1.address);

    expect(balanceAfter.sub(initialBalance)).to.equal(
      ethers.utils.parseEther("95")
    );
  });
});
