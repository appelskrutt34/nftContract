const MarketPlace = artifacts.require("MarketPlace");
const truffleAssert = require("truffle-assertions");

contract("MarketPlace", (accounts) => {
  it("should delete listing", async () => {
    const contract = await MarketPlace.deployed();

    await contract.createHuman("12345", { from: accounts[0] });
    await contract.createListing(0, 100, { from: accounts[0] });

    let listings = await contract.getListings();
    assert.equal(listings.length, 1);

    await contract.removeListing(0, { from: accounts[0] });

    let listingsNow = await contract.getListings();
    assert.equal(listingsNow.length, 0);
  });

  it("cant delete listing that dont exist", async () => {
    const contract = await MarketPlace.deployed();
    await truffleAssert.reverts(
      contract.removeListing(0, { from: accounts[0] })
    );
  });

  it("can buy listing", async () => {
    const contract = await MarketPlace.deployed();
    await contract.createListing(0, 100, { from: accounts[0] });

    await truffleAssert.passes(
      contract.buy(0, { from: accounts[1], value: 100 })
    );
    let listingsNow = await contract.getListings();
    assert.equal(listingsNow.length, 0);

    let owner = await contract.ownerOf(0);
    assert.equal(owner, accounts[1]);
  });

  it("cant buy listing that dont exist", async () => {
    const contract = await MarketPlace.deployed();
    await truffleAssert.reverts(
      contract.buy(2, { from: accounts[1], value: 100 })
    );
  });
});
