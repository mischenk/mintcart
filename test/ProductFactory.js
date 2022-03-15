const { expect } = require("chai");

describe("ProductFactory", () => {
  let ProductFactory, productFactory, addr1, addr2, addr3, addr4, addr5;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    ProductFactory = await ethers.getContractFactory("ProductFactory");
    productFactory = await ProductFactory.deploy("https://ipfs.io/ipfs/1234/");
  });

  describe("Create product", () => {
    it("Should create a product", async () => {
      let count = await productFactory.tokenIds();
      expect(count).to.equal(0);
      await productFactory.createProduct(1, 10);
      count = await productFactory.tokenIds();
      expect(count).to.equal(1);
      await productFactory.createProduct(1, 10);
      count = await productFactory.tokenIds();
      expect(count).to.equal(2);
    });
  });

  describe("Fetch products", () => {
    it("Should fetch all products", async () => {
      let products = await productFactory.fetchProducts();
      expect(products.length).to.equal(0);
      await productFactory.createProduct(1, 10);
      products = await productFactory.fetchProducts();
      expect(products.length).to.equal(1);
    });
  });
});
