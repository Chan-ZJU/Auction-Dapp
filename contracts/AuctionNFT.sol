// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AuctionItem is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(string => uint256) hashes;

    constructor() ERC721("AuctionItem", "AITM") {}

    function awardItem(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        require(hashes[tokenURI] != 1, "the NFT has been minted");
        hashes[tokenURI] = 1;
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
