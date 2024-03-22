const { expect } = require("chai");
const fs = require("fs");
const { ethers } = require("hardhat");
const { delay, fromBigNum, toBigNum } = require("./utils.js");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

var owner;
var idoContract;
var pekoContract;

describe("deploy contracts", function () {
  it("Create account", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    console.log("owner address", owner.address);
    provider = ethers.provider;
    var tx = await owner.sendTransaction({
      to: addr1.address,
      value: ethers.utils.parseUnits("100", 18),
    });
    await tx.wait();
  });

  it("deploy contracts", async function () {
    //QE token deployment
    const ERC20TOKEN = await ethers.getContractFactory("NormalToken");
    pekoContract = await ERC20TOKEN.deploy("PEKO REWARD", "PEKO");
    await pekoContract.deployed();

    usdtContract = await ERC20TOKEN.deploy("USD STABLE", "USDT");
    await usdtContract.deployed();

    const IDOContract = await ethers.getContractFactory("IDO");
    idoContract = await IDOContract.deploy(
      pekoContract.address,
      "0xc3aea10d78624b2e7e91a8a76095812b9a1f7d16f222a48084e9cdda9a2f317f"
    );
    await idoContract.deployed();
  });
});

describe("contracts test", function () {
  it("send token to Contract", async () => {
    await pekoContract.transfer(idoContract.address, toBigNum("100000000", 6));
  });

  it("set private sale", async () => {
    var tx = await idoContract.startSale(1);
    await tx.wait();
    var currentPrice = await idoContract.getPrice();
    console.log("Current Price after start private sale ", currentPrice);
  });

  it("buy token with 0.1 eth and 9 eth", async () => {
    var tx = await idoContract.buy(
      [
        "0x04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54",
        "0x9d997719c0a5b5f6db9b8ac69a988be57cf324cb9fffd51dc2c37544bb520d65",
        "0x836373fac8708dc51c247983d3c03f9beea10831041c1913017982304e688e08",
      ],
      { value: toBigNum("0.2", 18) }
    );
    await tx.wait();

    var claimAmount = await idoContract.getClaimAmount(owner.address);
    console.log("Claim amount after buy 0.2 eth ", claimAmount);

    // var tx = await idoContract.buy({ value: toBigNum("9.8", 18) });
    // await tx.wait();

    // var claimAmount = await idoContract.getClaimAmount(owner.address);
    // console.log("Claim amount after buy 9 eth ", claimAmount);

    // var currentPrice = await idoContract.getPrice();
    // console.log("Current Price ", currentPrice);

    // var tx = await idoContract.claimRewardToken();
    // await tx.wait();
  });

  it("set public sale", async () => {
    var tx = await idoContract.startSale(2);
    await tx.wait();
    var tx = await idoContract.connect(addr1).buy([], { value: toBigNum("70", 18) });
    await tx.wait();
    var claimAmount = await idoContract.getClaimAmount(owner.address);
    console.log("Claim amount after buy 70 eth ", claimAmount);
    //   var tx = await idoContract.buy({ value: toBigNum("10", 18) });
    //   await tx.wait();
    //   var claimAmount = await idoContract.getClaimAmount(owner.address);
    //   console.log("Claim amount after buy 10 eth ", claimAmount);
    //   var currentPrice = await idoContract.getPrice();
    //   console.log("Current Price ", currentPrice);
    //   var tx = await idoContract.claimRewardToken();
    //   await tx.wait();
  });
});
