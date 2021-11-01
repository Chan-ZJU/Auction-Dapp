import React, { Component } from "react";
import Home from './ui/ui';
import "./App.css";
const pinataApiKey = "1e57bed1d89a30e5a5a7";
const pinataSecretApiKey = "81e1b6cf23942787bf6a8b55cd83ac96ab46a37600e48b146d0a2a55d0f4f79a";
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

let web3 = require('./util/initWeb3')
let auctionInstance = require('./eth/auction')
let NFTinstance = require('./eth/auctionNFT')

class App extends Component{
  //pass to ui props
  constructor(props) {
    super(props);
    this.state = {
      account: '',

    }
  }



  pinFileToIPFS = async () => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let data = new FormData();
  data.append("file", fs.createReadStream("./pathtoyourfile.png"));
  const res = await axios.post(url, data, {
    maxContentLength: "Infinity", 
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      "pinata_api_key": pinataApiKey, 
      "pinata_secret_api_key": pinataSecretApiKey,
    },
  });
  console.log(res.data);
  };
  



  componentDidMount() {
  }

  async componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData()
  {
    let accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
  }

  render() {
    return (
      <div>
        <p>hello {this.state.account}</p>
        <p>铸造NFT</p>
        
        
        <form onSubmit={(event) => {
          event.preventDefault()
          var price = document.getElementById("p").value 
          var limit = document.getElementById("i").value 
          this.state.contract.methods.addArtItem(price, this.state.ipfsHash, limit).send({ from: this.state.account }) 
        }}>
          <label>
          Price:
          <input id="p" type="number" name="price" />
          </label>
          <label>
            Increment
          <input id="i" type="number" name="limit" />
          </label>
          <input type='submit' />
        </form>  
      </div>
    );
  }
}

export default App;