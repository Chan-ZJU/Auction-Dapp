# CZ's Auction Dapp for NFT
## Pre-installed (You must Download the followin dependencies)
- Node v16.13.0
- Npm v8.1.0
- IPFS v0.10.0
- Truffle v5.4.16 (core: 5.4.16)
- Solidity - 0.8.9 (solc-js)
- Web3.js v1.5.3
## How to Run
> Take the following instructions in order
1. clone the repository
```bash
git clone https://github.com/Chan-ZJU/Auction-Dapp.git
(or git clone git@github.com:Chan-ZJU/Auction-Dapp.git)
```

2. Then start ganache to run a local net (make sure the port num is 8545)
![port](imgs/ganache_port.jpg)

3. Then open a new terminal start IPFS, run the following script:
```bash
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"GET\", \"POST\"]'
ipfs daemon
```
4. run npm install to install the dependencies
```bash
npm install
```

5. Then deploy the contract on your local net (ganache)
```bash
truffle deploy --reset
```

6. After deploy by truffle:
![address](imgs/deploy_address.png)
copy the contract address and paste it to `'Auction-Dapp/src/eth/auction.js'`:
![paste](imgs/paste.jpg)

8. link truffle projects to your ganache local network:
![truffle](imgs/truffle.jpg)
Click `ADD PROJECT`, choose `Auction-Dapp/truffle-config.js`
![truffle_link](imgs/truffle_link.jpg)
Then click `Save and Restart`
![save](imgs/save.jpg)
the result is like this:
![result](imgs/result.jpg)

9.  Then run the project
```bash
npm start
```