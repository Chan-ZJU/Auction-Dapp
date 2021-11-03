//SPDX-License-Identifier: MIT
// pragma experimental ABIEncoderV2;
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
            string[] memory,
            bool[] memory
        )
    {
        uint256 num = NFTOwners[owner].length;
        string[] memory res = new string[](num);
        bool[] memory isAuctioned = new bool[](num);
        for (uint256 i = 0; i < num; i++) {
            res[i] = tokenURI(NFTOwners[owner][i]);
            isAuctioned[i] = isNFTAuctioned[NFTOwners[owner][i]];
        }
        return (num, NFTOwners[owner], res, isAuctioned);
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

    mapping(uint256 => bool) public isNFTAuctioned;
    mapping(uint256 => uint256) public NFT_MapTo_AuctionID;

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
        NFT_MapTo_AuctionID[nftID] = auction_array.length;
        isNFTAuctioned[nftID] = true;
        newAuction.beneficiary = payable(msg.sender);
        newAuction.start_price = begin_price;
        newAuction.highest_price = begin_price;
        newAuction.end_time = finish_time + block.timestamp;
        newAuction.is_ended = false;
        auction_owners[msg.sender].push(auction_array.length);
        auction_array.push(newAuction);
    }

    function viewMyAllAuction_URI_price(address user)
        public
        view
        returns (
            string[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        uint256 count = auction_owners[user].length;
        string[] memory URI = new string[](count);
        uint256[] memory start_price = new uint256[](count);
        uint256[] memory highest_price = new uint256[](count);

        // Show_Auction_Struct memory curr;
        for (uint256 i = 0; i < count; i++) {
            uint256 auction_id = auction_owners[user][i];
            Auction_struct memory curr_auction = auction_array[auction_id];
            URI[i] = tokenURI(curr_auction.NFTid);
            start_price[i] = curr_auction.start_price;
            highest_price[i] = curr_auction.highest_price;

            // All[i] = curr;
        }
        return (URI, start_price, highest_price);
    }

    function viewMyAllAuction_time_isended_auctionID(address user)
        public
        view
        returns (
            uint256[] memory,
            bool[] memory,
            uint256[] memory
        )
    {
        uint256 count = auction_owners[user].length;
        uint256[] memory end_time = new uint256[](count);
        bool[] memory is_ended = new bool[](count);
        uint256[] memory auctionID = new uint256[](count);

        // Show_Auction_Struct memory curr;
        for (uint256 i = 0; i < count; i++) {
            uint256 auction_id = auction_owners[user][i];
            Auction_struct memory curr_auction = auction_array[auction_id];
            end_time[i] = curr_auction.end_time;
            is_ended[i] = curr_auction.is_ended;
            auctionID[i] = auction_id;

            // All[i] = curr;
        }
        return (end_time, is_ended, auctionID);
    }

    function viewAllAuction_URI_price()
        public
        view
        returns (
            string[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        uint256 count = auction_array.length;
        string[] memory URI = new string[](count);
        uint256[] memory start_price = new uint256[](count);
        uint256[] memory highest_price = new uint256[](count);

        // Show_Auction_Struct memory curr;
        for (uint256 i = 0; i < count; i++) {
            uint256 auction_id = i;
            Auction_struct memory curr_auction = auction_array[auction_id];
            URI[i] = tokenURI(curr_auction.NFTid);
            start_price[i] = curr_auction.start_price;
            highest_price[i] = curr_auction.highest_price;

            // All[i] = curr;
        }
        return (URI, start_price, highest_price);
    }

    function viewAllAuction_time_isended_auctionID()
        public
        view
        returns (
            uint256[] memory,
            bool[] memory,
            uint256[] memory
        )
    {
        uint256 count = auction_array.length;
        uint256[] memory end_time = new uint256[](count);
        bool[] memory is_ended = new bool[](count);
        uint256[] memory auctionID = new uint256[](count);

        // Show_Auction_Struct memory curr;
        for (uint256 i = 0; i < count; i++) {
            uint256 auction_id = i;
            Auction_struct memory curr_auction = auction_array[auction_id];
            end_time[i] = curr_auction.end_time;
            is_ended[i] = curr_auction.is_ended;
            auctionID[i] = auction_id;

            // All[i] = curr;
        }
        return (end_time, is_ended, auctionID);
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
