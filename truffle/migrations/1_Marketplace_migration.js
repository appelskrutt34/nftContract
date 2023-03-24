var MarketPlace = artifacts.require("MarketPlace");
var TokenContract = artifacts.require("TokenContract");

module.exports = function (deployer) {
  deployer.deploy(MarketPlace);
  deployer.deploy(TokenContract);
};
