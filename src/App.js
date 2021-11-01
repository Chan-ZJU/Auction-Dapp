import React, { Component } from "react";
import Home from "./ui/ui";
import "./App.css";
import { create } from "ipfs-http-client";
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI({ host: "localhost", port: "5001", protocol: "http" });

/**
 * use following commands to configure ipfs
 * ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'
 * ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"GET\", \"POST\"]'
 */
let saveImageOnIpfs = (reader) => {
  return new Promise(function (resolve, reject) {
    const buffer = Buffer.from(reader.result);
    ipfs
      .add(buffer)
      .then((response) => {
        console.log(response);
        resolve(response[0].hash);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

let web3 = require("./util/initWeb3");
let auctionInstance = require("./eth/auction");
let NFTinstance = require("./eth/auctionNFT");

class App extends Component {
  //pass to ui props
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      imgSrc: null,
    };
  }

  componentDidMount() {}

  async componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    let accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  }

  render() {
    return (
      <div>
        <Home />
        <p>hello {this.state.account}</p>
        <p>铸造NFT</p>
        <p>上传图片</p>
        <div>
          <label id="file">Choose file to upload</label>
          <input
            type="file"
            ref="file"
            id="file"
            name="file"
            multiple="multiple"
          />
        </div>
        <div>
          <button
            onClick={() => {
              var file = this.refs.file.files[0];
              var reader = new FileReader();
              // reader.readAsDataURL(file);
              reader.readAsArrayBuffer(file);
              reader.onloadend = (e) => {
                console.log(reader);
                // 上传数据到IPFS
                saveImageOnIpfs(reader).then((hash) => {
                  console.log(hash);
                  this.setState({ imgSrc: hash });
                });
              };
            }}
          >
            Submit
          </button>
        </div>
        {this.state.imgSrc ? (
          <div>
            <h2>{"http://localhost:8080/ipfs/" + this.state.imgSrc}</h2>
            <img
              alt="testIPFS"
              style={{
                width: 1600,
              }}
              src={"http://localhost:8080/ipfs/" + this.state.imgSrc}
            />
          </div>
        ) : (
          <p>hello IPFS</p>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            var price = document.getElementById("p").value;
            var limit = document.getElementById("i").value;
            this.state.contract.methods
              .addArtItem(price, this.state.ipfsHash, limit)
              .send({ from: this.state.account });
          }}
        >
          <label>
            Price:
            <input id="p" type="number" name="price" />
          </label>
          <label>
            Increment
            <input id="i" type="number" name="limit" />
          </label>
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
