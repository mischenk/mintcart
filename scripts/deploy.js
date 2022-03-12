const hre = require("hardhat");

async function main() {
  const Product = await hre.ethers.getContractFactory("Product");
  const product = await Product.deploy();

  await product.deployed();

  console.log("Product deployed to:", product.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
