#### start ganache to run a local net(port num: 8545)
#### start IPFS, run the following script:
```bash
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"GET\", \"POST\"]'
ipfs daemon
```
#### npm start