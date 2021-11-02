//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    //the struct for every auction that has been created
    struct Auction_struct {
        uint256 NFTid;
        address payable beneficiary;
        uint256 start_price;
        uint256 hightest_price;
        uint256 end_time;
        bool is_ended;
    }

    //every address(user) has an uint array of his own auction IDs
    mapping(address => uint256[]) public auction_owners;

    //the array to store all the auctions(include ongoing and ended auctions)
    Auction_struct[] public auction_array;

    //every bid has a from address and a value
    struct Bid {
        address from;
        uint256 value;
    }

    //every auction has its own ID, so every auction has an array recording all the bids
    mapping(uint256 => Bid[]) auction_bids;

    //create a new Auction
    function createAuction(
        uint256 nftID,
        uint256 begin_price,
        uint256 finish_time
    ) public {
        uint256 auctionId = auction_array.length;
        Auction_struct memory newAuction;
        newAuction.NFTid = nftID;
        newAuction.beneficiary = payable(msg.sender);
        newAuction.start_price = begin_price;
        newAuction.hightest_price = begin_price;
        newAuction.end_time = finish_time;
        newAuction.is_ended = false;
        auction_array.push(newAuction);
        auction_owners[msg.sender].push(auctionId);
    }

    //TODO
    // function viewAuction(address user) public {

    // }

    function bid(uint256 auctionID) public payable {
        require(
            block.timestamp <= auction_array[auctionID].end_time,
            "Auction ended"
        );
        uint256 last = auction_bids[auctionID].length;
        if (last > 0) {
            require(
                msg.value > auction_bids[auctionID][last - 1].value,
                "You need to offer a higher price"
            );
        }
        Bid memory newBid;
        newBid.from = msg.sender;
        newBid.value = msg.value;
        auction_bids[auctionID].push(newBid);
        //so auction_bids[auctionID] is of ascending order
    }

    //the highest bidder need to endAuction to claim the NFT
    function endAuction(uint256 auctionID) public {
        require(
            block.timestamp > auction_array[auctionID].end_time,
            "Auction not yet ended"
        );
        require(!auction_array[auctionID].is_ended, "NFT has been claimed");
        auction_array[auctionID].is_ended = true;
        //TODO:transfer the ownership of NFT
    }

    //get the auction number
    function getAuctionCount() public view returns (uint256) {
        return auction_array.length;
    }

    //get the number of bids on an particular auction
    function getBidCount(uint256 auctionID) public view returns (uint256) {
        return auction_bids[auctionID].length;
    }

    //get the auctions of a user
    function getMyAuction(address user) public view returns (uint256[] memory) {
        return auction_owners[user];
    }

    //get Auction info by auctionID
    function getAuctionInfo(uint256 auctionID)
        public
        view
        returns (
            uint256 NFTID,
            address payable beneficiary,
            uint256 start_price,
            uint256 hightest_price,
            uint256 end_time,
            bool is_ended
        )
    {
        return (
            auction_array[auctionID].NFTid,
            auction_array[auctionID].beneficiary,
            auction_array[auctionID].start_price,
            auction_array[auctionID].hightest_price,
            auction_array[auctionID].end_time,
            auction_array[auctionID].is_ended
        );
    }
}
