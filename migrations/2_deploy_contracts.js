var AuctionItem = artifacts.require("AuctionItem");
var Auction = artifacts.require("Auction");

module.exports = function (deployer) {
    deployer.deploy(AuctionItem);
    deployer.deploy(Auction);
}