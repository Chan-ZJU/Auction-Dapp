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
      showMyNFT_isAuctioned: null,

      isShowMyOngoingNFT: false,
      showMyOngingNFT_num: 0,
      showMyOngingNFT_URIs: null,
      showMyOngingNFT_start_prices: null,
      showMyOngingNFT_highest_prices: null,
      showMyOngingNFT_end_times: null,
      showMyOngingNFT_is_endeds: null,
      showMyOngingNFT_auctionIDs: null,

      isShowNFTMarket: false,
      showMarketNFT_num: 0,
      showMarketNFT_URIs: null,
      showMarketNFT_start_prices: null,
      showMarketNFT_highest_prices: null,
      showMarketNFT_end_times: null,
      showMarketNFT_is_endeds: null,
      showMarketNFT_auctionIDs: null,
    };
  }

  componentDidMount() {}

  async componentWillMount() {
    this.loadBlockchainData();
  }

  //TODO:切换账户不会刷新，如果切换后直接mint，会提示需要账户信息
  async loadBlockchainData() {
    console.log("load blockchain data");
    let accounts = await web3.eth.getAccounts();

    let showMyNFTRes = await auctionInstance.methods
      .showMyNFT(accounts[0])
      .call();
    console.log(showMyNFTRes);
    let showMyNFTIds = showMyNFTRes[1];
    let showMyNFTURIs = showMyNFTRes[2];
    let showMyNFTnum = parseInt(showMyNFTRes[0]);
    let showMyNFTIsAuctioned = showMyNFTRes[3];

    let isShowMyOngoingNFTRes1 = await auctionInstance.methods
      .viewMyAllAuction_URI_price(accounts[0])
      .call();
    console.log(isShowMyOngoingNFTRes1);
    let isShowMyOngoingNFTRes2 = await auctionInstance.methods
      .viewMyAllAuction_time_isended_auctionID(accounts[0])
      .call();
    console.log(isShowMyOngoingNFTRes2);
    let showMyOngingNFTURIs = isShowMyOngoingNFTRes1[0];
    let showMyOngingNFTnums = showMyOngingNFTURIs.length;
    let showMyOngingNFTstart_prices = isShowMyOngoingNFTRes1[1];
    let showMyOngingNFThighest_prices = isShowMyOngoingNFTRes1[2];
    let showMyOngingNFTendTimes = isShowMyOngoingNFTRes2[0];
    let showMyOngingNFTisendeds = isShowMyOngoingNFTRes2[1];
    let showMyOngingNFTauctionIDs = isShowMyOngoingNFTRes2[2];

    let isShowMarketNFTRes1 = await auctionInstance.methods
      .viewAllAuction_URI_price()
      .call();
    console.log(isShowMarketNFTRes1);
    let isShowMarketNFTRes2 = await auctionInstance.methods
      .viewAllAuction_time_isended_auctionID()
      .call();
    console.log(isShowMarketNFTRes2);
    let showMarketNFTURIs = isShowMarketNFTRes1[0];
    let showMarketNFTnums = showMarketNFTURIs.length;
    let showMarketNFTstart_prices = isShowMarketNFTRes1[1];
    let showMarketNFThighest_prices = isShowMarketNFTRes1[2];
    let showMarketNFTendTimes = isShowMarketNFTRes2[0];
    let showMarketNFTisendeds = isShowMarketNFTRes2[1];
    let showMarketNFTauctionIDs = isShowMarketNFTRes2[2];

    this.setState({
      account: accounts[0],

      showMyNFT_num: showMyNFTnum,
      showMyNFT_IDs: showMyNFTIds,
      showMyNFT_URIs: showMyNFTURIs,
      showMyNFT_isAuctioned: showMyNFTIsAuctioned,

      showMyOngingNFT_num: showMyOngingNFTnums,
      showMyOngingNFT_URIs: showMyOngingNFTURIs,
      showMyOngingNFT_auctionIDs: showMyOngingNFTauctionIDs,
      showMyOngingNFT_end_times: showMyOngingNFTendTimes,
      showMyOngingNFT_highest_prices: showMyOngingNFThighest_prices,
      showMyOngingNFT_is_endeds: showMyOngingNFTisendeds,
      showMyOngingNFT_start_prices: showMyOngingNFTstart_prices,

      showMarketNFT_num: showMarketNFTnums,
      showMarketNFT_URIs: showMarketNFTURIs,
      showMarketNFT_auctionIDs: showMarketNFTauctionIDs,
      showMarketNFT_end_times: showMarketNFTendTimes,
      showMarketNFT_highest_prices: showMarketNFThighest_prices,
      showMarketNFT_is_endeds: showMarketNFTisendeds,
      showMarketNFT_start_prices: showMarketNFTstart_prices,
    });
  }

  resetAll = () => {
    this.setState({
      isShowMyNFT: false,
      isShowMyOngoingNFT: false,
      isShowNFTMarket: false,
    });
  };

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
      window.location.reload();
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

  createAuction = async (term, e) => {
    e.preventDefault();
    console.log(term);
    var price = document.getElementById("price").value;
    var time = document.getElementById("time").value;
    console.log(price, time);
    try {
      let res = await auctionInstance.methods
        .createAuction(term.ID, price, time)
        .send({ from: this.state.account, gas: "3000000" });
      alert("create auction success!");
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("create auction fail!");
    }
  };

  showMyNFT = () => {
    let res = [];
    for (let i = 0; i < this.state.showMyNFT_num; i++) {
      res.push({
        NFT_ID: this.state.showMyNFT_IDs[i],
        URI: this.state.showMyNFT_URIs[i],
        isAuctioned: this.state.showMyNFT_isAuctioned[i],
      });
    }
    console.log(res);

    return (
      <div>
        {res.map((term) => (
          <div>
            <p>URI:{term.URI}</p>
            <p>ID:{term.NFT_ID}</p>
            <img
              style={{ height: 180, width: 320 }}
              src={"http://localhost:8080/ipfs/" + term.URI}
            />
            {!term.isAuctioned ? (
              <form onSubmit={this.createAuction.bind(this, term)}>
                <label>
                  拍卖起价:
                  <input id="price" type="number" name="price" />
                </label>
                <br />
                <label>
                  持续时间（秒）：
                  <input id="time" type="number" name="time" />
                </label>
                <input type="submit" value="拍卖" />
              </form>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  showMyOngingNFT = () => {
    let res = [];

    for (let i = 0; i < this.state.showMyOngingNFT_num; i++) {
      res.push({
        URI: this.state.showMyOngingNFT_URIs[i],
        start_price: this.state.showMyOngingNFT_start_prices[i],
        highest_price: this.state.showMyOngingNFT_highest_prices[i],
        is_ended: this.state.showMyOngingNFT_is_endeds[i],
        end_time: this.state.showMyOngingNFT_end_times[i],
        auction_ID: this.state.showMyOngingNFT_auctionIDs[i],
      });
    }
    console.log(res);
    return res ? (
      <div>
        {res.map((term) => (
          <div>
            <p>URI:{term.URI}</p>
            <p>auction_ID:{term.auction_ID}</p>
            <p>
              起价: {term.start_price} 最高价: {term.highest_price}
            </p>
            <p>结束时间: {term.end_time}</p>
            <p>{term.is_ended ? "已结束" : "未结束"}</p>
            <img
              style={{ height: 180, width: 320 }}
              src={"http://localhost:8080/ipfs/" + term.URI}
            />
          </div>
        ))}
      </div>
    ) : null;
  };

  showNFTMarket = () => {
    let res = [];

    for (let i = 0; i < this.state.showMarketNFT_num; i++) {
      res.push({
        URI: this.state.showMarketNFT_URIs[i],
        start_price: this.state.showMarketNFT_start_prices[i],
        highest_price: this.state.showMarketNFT_highest_prices[i],
        is_ended: this.state.showMarketNFT_is_endeds[i],
        end_time: this.state.showMarketNFT_end_times[i],
        auction_ID: this.state.showMarketNFT_auctionIDs[i],
      });
    }
    console.log(res);
    return res ? (
      <div>
        {res.map((term) => (
          <div>
            <p>URI:{term.URI}</p>
            <p>auction_ID:{term.auction_ID}</p>
            <p>
              起价: {term.start_price} 最高价: {term.highest_price}
            </p>
            <p>结束时间: {term.end_time}</p>
            <p>{term.is_ended ? "已结束" : "未结束"}</p>
            <img
              style={{ height: 180, width: 320 }}
              src={"http://localhost:8080/ipfs/" + term.URI}
            />
          </div>
        ))}
      </div>
    ) : null;
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
                  this.resetAll();
                  console.log("click showMyNFT");
                  this.setState({ isShowMyNFT: true });
                  console.log(this.state.isShowMyNFT);
                }}
              >
                我铸造的NFT
              </button>
              <button
                onClick={() => {
                  this.resetAll();
                  console.log("click showMyOngingNFT");
                  this.setState({ isShowMyOngoingNFT: true });
                }}
              >
                我的NFT拍卖详情
              </button>
              <button
                onClick={() => {
                  this.resetAll();
                  console.log("click show NFT market");
                  this.setState({ isShowNFTMarket: true });
                }}
              >
                NFT市场
              </button>
            </div>
            {/* 下面是我铸造的NFT的内容 */}
            <div>{this.state.isShowMyNFT ? this.showMyNFT() : null}</div>
            {/* 下面是我所有拍卖的NFT的内容 */}
            <div>
              {this.state.isShowMyOngoingNFT ? this.showMyOngingNFT() : null}
            </div>
            {/* 下面是NFT市场的内容 */}
            <div>
              {this.state.isShowNFTMarket ? this.showNFTMarket() : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
