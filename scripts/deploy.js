const fs = require("fs");
const colors = require("colors");
const { ethers } = require("hardhat");
async function main() {
  // get network
  let [owner] = await ethers.getSigners();

  const ERC20TOKEN = await ethers.getContractFactory("NormalToken");
  tokenContract = await ERC20TOKEN.deploy("Peko Token", "PEKO", "3000000000000000", 6);
  await tokenContract.deployed();
  console.log(tokenContract.address);

  // fs.writeFileSync(
  //   `./build/${network.chainId}.json`,
  //   JSON.stringify(ledingContract, undefined, 4)
  // );

}

main()
  .then(() => {
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
