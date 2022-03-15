const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Product = await hre.ethers.getContractFactory("Product");
  const product = await Product.deploy("https://ipfs.io/ipfs/1234/");

  await product.deployed();

  console.log("Product deployed to:", product.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const productAddress = "${product.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
