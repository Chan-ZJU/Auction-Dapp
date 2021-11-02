import React, { Component, useReducer } from "react";
import Home from "./ui/ui";
import "./App.css";
import { create } from "ipfs-http-client";
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI({ host: "localhost", port: "5001", protocol: "http" });

let web3 = require("./util/initWeb3");
let auctionInstance = require("./eth/auction");
// let NFTinstance = require("./eth/auctionNFT");

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

class App extends Component {
  //pass to ui props
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      imgSrc: null,
      isShowMyNFT: false,
      showMyNFT_num: 0,
      showMyNFT_IDs: null,
      showMyNFT_URIs: null,
      showMyNFT_ID_URIs: null,
    };
  }

  componentDidMount() {}

  async componentWillMount() {
    this.loadBlockchainData();
  }

  //TODO:切换账户不会刷新，如果切换后直接mint，会提示需要账户信息
  async loadBlockchainData() {
    let accounts = await web3.eth.getAccounts();
    let showMyNFTRes = await auctionInstance.methods
      .showMyNFT(accounts[0])
      .call();
    let showMyNFTIds = showMyNFTRes[1];
    let showMyNFTURIs = showMyNFTRes[2];
    let showMyNFTnum = parseInt(showMyNFTRes[0]);
    let showMyNFT_ID_URI = [];
    for (let i = 0; i < showMyNFTnum; i++) {
      showMyNFT_ID_URI.push({
        ID: showMyNFTIds[i],
        URI: showMyNFTURIs[i],
      });
    }

    this.setState({
      account: accounts[0],
      showMyNFT_num: showMyNFTnum,
      showMyNFT_IDs: showMyNFTIds,
      showMyNFT_URIs: showMyNFTURIs,
      showMyNFT_ID_URIs: showMyNFT_ID_URI,
    });
  }

  mintNFT = async () => {
    console.log(this.state.account);
    console.log(this.state.imgSrc);
    try {
      console.log("debug");
      //TODO:没有启动私链的话会永久等待，应该报错，怎么解决
      let res = await auctionInstance.methods
        .awardItem(this.state.account, this.state.imgSrc)
        .send({ from: this.state.account, gas: "3000000" });
      // window.location.reload();
      alert("mint success!");
      console.log("mint success! ID: " + res);
      console.log(
        "balance:" +
          auctionInstance.methods.balanceOf(this.state.account).call()
      );
    } catch (e) {
      console.log(e);
      alert("mint fail!");
    }
  };

  createAuction = (ID, e) => {
    console.log(ID);
  };

  showMyNFT = () => {
    let res = [];
    for (let i = 0; i < this.state.showMyNFT_num; i++) {
      res.push({
        ID: this.state.showMyNFT_IDs[i],
        URI: this.state.showMyNFT_URIs[i],
      });
    }
    console.log(res);

    return (
      <div>
        {res.map((term) => (
          <div>
            <p>URI:{term.URI}</p>
            <p>ID:{term.ID}</p>
            <img
              style={{ height: 180, width: 320 }}
              src={"http://localhost:8080/ipfs/" + term.URI}
            />
            <button onClick={this.createAuction.bind(this, term.ID)}>
              拍卖
            </button>
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div>
        <Home
          account={this.state.account}
          imgSrc={this.state.imgSrc}
          uploadImage={this.uploadImage}
          mintNFT={this.mintNFT}
        />
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
            <button onClick={this.mintNFT}>mint</button>
            {this.state.imgSrc ? (
              <div>
                <h2>{"http://localhost:8080/ipfs/" + this.state.imgSrc}</h2>
                <img
                  alt="testIPFS"
                  style={{
                    height: 120,
                    width: 160,
                  }}
                  src={"http://localhost:8080/ipfs/" + this.state.imgSrc}
                />
              </div>
            ) : (
              <p>hello IPFS, no image uploaded</p>
            )}
            <div>
              <button
                onClick={() => {
                  console.log("click showMyNFT");
                  this.setState({ isShowMyNFT: true });
                  console.log(this.state.isShowMyNFT);
                }}
              >
                我的NFT
              </button>
            </div>
            <div>{this.state.isShowMyNFT ? this.showMyNFT() : null}</div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              var price = document.getElementById("p").value;
              var limit = document.getElementById("i").value;
              this.state.contract.methods
                .addArtItem(price, this.state.ipfsHash, limit)
                .send({ from: this.state.account });
            }}
          />
          <label>
            Price:
            <input id="p" type="number" name="price" />
          </label>
          <label>
            Increment
            <input id="i" type="number" name="limit" />
          </label>
          <input type="submit" />
          {/* </form> */}
        </div>
      </div>
    );
  }
}

export default App;
