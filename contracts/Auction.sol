//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Auction is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(string => uint256) hashes;

    //NFTOwners[address] stores the NFT IDs he owns
    mapping(address => uint256[]) public NFTOwners;
    mapping(uint256 => address[]) public NFTHistory;

    constructor() ERC721("AuctionItem", "AITM") {}

    function awardItem(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        require(hashes[tokenURI] == 0, "the NFT has been minted");
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        hashes[tokenURI] = 1;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        NFTOwners[recipient].push(newItemId);
        NFTHistory[newItemId].push(recipient);

        return newItemId;
    }

    function showMyNFT(address owner)
        public
        view
        returns (
            uint256,
            uint256[] memory,
            string[] memory
        )
    {
        uint256 num = NFTOwners[owner].length;
        string[] memory res = new string[](num);
        for (uint256 i = 0; i < num; i++) {
            res[i] = tokenURI(NFTOwners[owner][i]);
        }
        return (num, NFTOwners[owner], res);
    }

    function tokenID(string memory URI) public view returns (uint256) {
        return hashes[URI];
    }

    //the struct for every auction that has been created
    struct Auction_struct {
        uint256 NFTid;
        address payable beneficiary;
        uint256 start_price;
        uint256 highest_price;
        uint256 end_time;
        bool is_ended;
    }

    //the struct for showing auctions
    struct Show_Auction_Struct {
        uint256 auctionID;
        string URI;
        uint256 start_price;
        uint256 highest_price;
        uint256 end_time;
        bool is_ended;
    }

    //every address(user) has an uint array of his own auction ids
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
        require(msg.sender == ownerOf(nftID), "You are not user of the NFT!");
        Auction_struct memory newAuction;
        newAuction.NFTid = nftID;
        newAuction.beneficiary = payable(msg.sender);
        newAuction.start_price = begin_price;
        newAuction.highest_price = begin_price;
        newAuction.end_time = finish_time + block.timestamp;
        newAuction.is_ended = false;
        auction_owners[msg.sender].push(auction_array.length);
        auction_array.push(newAuction);
    }

    function viewMyAllAuction(address user)
        public
        view
        returns (Show_Auction_Struct[] memory)
    {
        uint256 count = auction_owners[user].length;
        Show_Auction_Struct[] memory All = new Show_Auction_Struct[](count);
        Show_Auction_Struct memory curr;
        for (uint256 i = 0; i < count; i++) {
            uint256 auction_id = auction_owners[user][i];
            Auction_struct memory curr_auction = auction_array[auction_id];
            curr.URI = tokenURI(curr_auction.NFTid);
            curr.start_price = curr_auction.start_price;
            curr.highest_price = curr_auction.highest_price;
            curr.end_time = curr_auction.end_time;
            curr.is_ended = curr_auction.is_ended;
            curr.auctionID = auction_id;
            All[i] = curr;
        }
        return All;
    }

    function ViewAllAuction()
        public
        view
        returns (Show_Auction_Struct[] memory)
    {
        uint256 count = auction_array.length;
        Show_Auction_Struct[] memory All = new Show_Auction_Struct[](count);
        Show_Auction_Struct memory curr;
        for (uint256 i = 0; i < count; i++) {
            curr.URI = tokenURI(auction_array[i].NFTid);
            curr.start_price = auction_array[i].start_price;
            curr.highest_price = auction_array[i].highest_price;
            curr.end_time = auction_array[i].end_time;
            curr.is_ended = auction_array[i].is_ended;
            curr.auctionID = i;
            All[i] = curr;
        }
        return All;
    }

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
        //make a new bid, change highest_price
        Bid memory newBid;
        newBid.from = msg.sender;
        newBid.value = msg.value;
        auction_bids[auctionID].push(newBid);
        //so auction_bids[auctionID] is of ascending order
        auction_array[auctionID].highest_price = msg.value;
    }

    //the highest bidder need to endAuction to claim the NFT, and refund the lower price bidder and the beneficiary
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
            uint256 highest_price,
            uint256 end_time,
            bool is_ended
        )
    {
        return (
            auction_array[auctionID].NFTid,
            auction_array[auctionID].beneficiary,
            auction_array[auctionID].start_price,
            auction_array[auctionID].highest_price,
            auction_array[auctionID].end_time,
            auction_array[auctionID].is_ended
        );
    }
}
