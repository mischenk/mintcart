const { expect } = require("chai");

describe("Product", () => {
  let Product, product, addr1, addr2, addr3, addr4, addr5;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    Product = await ethers.getContractFactory("Product");
    product = await Product.deploy("https://ipfs.io/ipfs/1234/");
  });

  describe("Fetch products", () => {
    it("Should fetch all products", async () => {
      let products = await product.fetchProducts();
      expect(products.length).to.equal(0);
      await product.createProduct(1, 10);
      products = await product.fetchProducts();
      expect(products.length).to.equal(1);
    });
  });
});
