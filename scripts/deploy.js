const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const ProductFactory = await hre.ethers.getContractFactory("ProductFactory");
  const productFactory = await ProductFactory.deploy();
  await productFactory.deployed();

  console.log("Product deployed to:", productFactory.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const productFactoryAddress = "${productFactory.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
