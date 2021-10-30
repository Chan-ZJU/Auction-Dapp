//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    //the struct for every auction that has been created
    struct Auction_struct {
        string name;
        address payable beneficiary;
        uint256 start_price;
        uint256 hightest_price;
        uint256 end_time;
        bool is_ended;
    }

    //every address(user) has an uint array of his own auction IDs
    mapping(address => uint256[]) auction_owners;

    //the array to store all the auctions(include ongoing and ended auctions)
    Auction_struct[] public auction_array;

    //every bid has a from address and a value
    struct Bid {
        address from;
        uint256 value;
    }

    //every auction has its own ID, so every auction has an array recording all the bids
    mapping(uint256 => Bid[]) auction_bids;

    function createAuction(
        string memory auction_name,
        uint256 begin_price,
        uint256 finish_time
    ) public {
        uint256 auctionId = auction_array.length;
        Auction_struct memory newAuction;
        newAuction.name = auction_name;
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
        require(block.timestamp <= auction_array[auctionID].end_time);
        Bid memory newBid;
        newBid.from = msg.sender;
        newBid.value = msg.value;
        auction_bids[auctionID].push(newBid);
    }
}
