// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

// contract AuctionItem is ERC721URIStorage {
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;
//     mapping(string => uint256) hashes;

//     //NFTOwners[address] stores the NFT IDs he owns
//     mapping(address => uint256[]) public NFTOwners;
//     mapping(uint256 => address[]) public NFTHistory;

//     constructor() ERC721("AuctionItem", "AITM") {}

//     function awardItem(address recipient, string memory tokenURI)
//         public
//         returns (uint256)
//     {
//         require(hashes[tokenURI] != 1, "the NFT has been minted");
//         hashes[tokenURI] = 1;
//         _tokenIds.increment();

//         uint256 newItemId = _tokenIds.current();
//         _mint(recipient, newItemId);
//         _setTokenURI(newItemId, tokenURI);

//         NFTOwners[recipient].push(newItemId);
//         NFTHistory[newItemId].push(recipient);

//         return newItemId;
//     }

//     function showMyNFT(address owner) public view returns (uint, string[] memory) {
//         uint num = NFTOwners[owner].length;
//         string[] memory res = new string[](num);
//         for(uint i = 0; i<num; i++)
//         {
//             res[i] = tokenURI(NFTOwners[owner][i]);
//         }
//         return (num,res);
//     }
// }
