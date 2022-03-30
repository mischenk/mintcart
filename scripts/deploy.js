const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

const ENV_FILE_LOCATION = path.resolve(__dirname, "../app/.env");

function updateEnvVar(key, value) {
  const env = fs.readFileSync(ENV_FILE_LOCATION).toString();
  const newEnv = env.includes(key)
    ? env
        .split(/\n/)
        .map((s) => (s.startsWith(key) ? `${key}=${value}` : s))
        .join("\n")
    : `${env.trim()}\n${key}=${value}\n`;
  fs.writeFileSync(ENV_FILE_LOCATION, newEnv);
}

async function main() {
  const ProductFactory = await ethers.getContractFactory("ProductFactory");
  const contract = await ProductFactory.deploy();

  await contract.deployed();

  console.log("ProductFactory deployed to:", contract.address, network.name);

  if (network.name === "localhost") {
    updateEnvVar("NEXT_PUBLIC_LOCAL_ADDRESS", contract.address);
  } else {
    fs.appendFileSync(
      "app/artifacts/addresses.js",
      `module.exports.${network.name.toUpperCase()}_ADDRESS = "${
        contract.address
      }";\n`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
