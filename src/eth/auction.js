let web3 = require("../util/initWeb3");
let abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "auction_array",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address payable",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "start_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "hightest_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end_time",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "is_ended",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256",
      },
    ],
    name: "bid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "auction_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "begin_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "finish_time",
        type: "uint256",
      },
    ],
    name: "createAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256",
      },
    ],
    name: "endAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAuctionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256",
      },
    ],
    name: "getAuctionInfo",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address payable",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "start_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "hightest_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end_time",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "is_ended",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionID",
        type: "uint256",
      },
    ],
    name: "getBidCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getMyAuction",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
let address = "0x9be59d406BCc7a5B65475c82Ff6B3198d7CAef53";
let contractAuctionInstance = new web3.eth.Contract(abi, address);
module.exports = contractAuctionInstance;
