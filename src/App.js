import React, { Component } from "react";
import Home from "./ui/ui";
import "./App.css";
import { Button, Menu, Divider, BackTop } from "antd";
import "antd/dist/antd.css";
import {
  HomeOutlined,
  SettingFilled,
  ShopOutlined,
  SendOutlined,
  StarOutlined,
  UploadOutlined,
  SketchOutlined,
} from "@ant-design/icons";
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

      price: null,
      time: null,

      isShowMintNFT: false,

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

      isShowHistory: false,
      NFTHistory: null,
      history: null,

      isShowBuyNFT: false,
      showBuyNFT_price: null,
      showBuyNFT_URI: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let target = event.target;
    if (target.id === "price") {
      this.setState({ price: target.value });
    }
    if (target.id === "time") {
      this.setState({ time: target.value });
    }
  }

  componentDidMount() {}

  async componentWillMount() {
    this.loadBlockchainData();
  }

  accountInterval = setInterval(async () => {
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] !== this.state.account && typeof accounts[0] != undefined) {
      // window.location.reload();
      this.resetAll();
      await this.loadBlockchainData();
    }
  }, 300);

  //TODO:切换账户不会刷新，如果切换后直接mint，会提示需要账户信息
  async loadBlockchainData() {
    let accounts = await web3.eth.getAccounts();

    let showMyNFTRes = await auctionInstance.methods
      .showMyNFT(accounts[0])
      .call();
    let showMyNFTIds = showMyNFTRes[1];
    let showMyNFTURIs = showMyNFTRes[2];
    let showMyNFTnum = parseInt(showMyNFTRes[0]);
    let showMyNFTIsAuctioned = showMyNFTRes[3];

    let isShowMyOngoingNFTRes1 = await auctionInstance.methods
      .viewMyAllAuction_URI_price(accounts[0])
      .call();
    let isShowMyOngoingNFTRes2 = await auctionInstance.methods
      .viewMyAllAuction_time_isended_auctionID(accounts[0])
      .call();
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
    let isShowMarketNFTRes2 = await auctionInstance.methods
      .viewAllAuction_time_isended_auctionID()
      .call();
    let showMarketNFTURIs = isShowMarketNFTRes1[0];
    let showMarketNFTnums = showMarketNFTURIs.length;
    let showMarketNFTstart_prices = isShowMarketNFTRes1[1];
    let showMarketNFThighest_prices = isShowMarketNFTRes1[2];
    let showMarketNFTendTimes = isShowMarketNFTRes2[0];
    let showMarketNFTisendeds = isShowMarketNFTRes2[1];
    let showMarketNFTauctionIDs = isShowMarketNFTRes2[2];

    let NFTHistory = [];
    let res;
    for (let i = 0; i < showMarketNFTauctionIDs.length; i++) {
      res = await auctionInstance.methods
        .traceNFTHistory(showMarketNFTauctionIDs[i])
        .call();
      NFTHistory.push(res);
    }

    let resBuy = await auctionInstance.methods
      .showBoughtNFT(accounts[0])
      .call();
    let showBuyNFT_price = resBuy[0];
    let showBuyNFT_URI = resBuy[1];

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

      NFTHistory: NFTHistory,

      showBuyNFT_URI: showBuyNFT_URI,
      showBuyNFT_price: showBuyNFT_price,
    });
  }

  resetAll = () => {
    this.setState({
      isShowMintNFT: false,
      isShowMyNFT: false,
      isShowMyOngoingNFT: false,
      isShowNFTMarket: false,
      isShowHistory: false,
      isShowBuyNFT: false,
    });
  };

  mintNFT = async () => {
    try {
      //TODO:没有启动私链的话会永久等待，应该报错，怎么解决
      await auctionInstance.methods
        .awardItem(this.state.account, this.state.imgSrc)
        .send({ from: this.state.account, gas: "3000000" });
      alert("mint success!");
      this.resetAll();
      await this.loadBlockchainData();
      this.setState({ isShowMintNFT: true });
    } catch (e) {
      console.log(e);
      alert("mint fail!");
    }
  };

  createAuction = async (term, e) => {
    e.preventDefault();
    let price = this.state.price;
    let time = this.state.time;
    console.log(price, time);
    price = web3.utils.toWei(price, "ether");
    try {
      await auctionInstance.methods
        .createAuction(term.NFT_ID, price, time)
        .send({ from: this.state.account, gas: "3000000" });
      alert("create auction success!");
      this.resetAll();
      await this.loadBlockchainData();
      this.setState({ isShowMyNFT: true });
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
            <img
              style={{ height: 180, width: 320 }}
              alt="NFT"
              src={"http://localhost:8080/ipfs/" + term.URI}
            />
            {!term.isAuctioned ? (
              <form onSubmit={this.createAuction.bind(this, term)}>
                <label>
                  拍卖起价（ether）:
                  <input
                    id="price"
                    type="number"
                    step="0.000000000000000001"
                    name="price"
                    onChange={this.handleChange}
                    ref={(input) => {
                      this.start_price = input;
                    }}
                  />
                </label>
                <br />
                <label>
                  持续时间（秒）：
                  <input
                    id="time"
                    type="number"
                    step="0.01"
                    name="time"
                    onChange={this.handleChange}
                    ref={(input) => {
                      this.time = input;
                    }}
                  />
                </label>
                <input type="submit" value="拍卖" />
              </form>
            ) : null}
            <Divider />
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
            <p>
              起价: {web3.utils.fromWei(term.start_price, "ether")} ether
              <br />
              最高价: {web3.utils.fromWei(term.highest_price, "ether")} ether
            </p>
            <p>结束时间: {new Date(term.end_time * 1000).toString()}</p>
            <p>{term.is_ended ? "已结束" : "未结束"}</p>
            <img
              style={{ height: 180, width: 320 }}
              alt="NFT"
              src={"http://localhost:8080/ipfs/" + term.URI}
            />
            <Divider />
          </div>
        ))}
      </div>
    ) : null;
  };

  bid = async (term, e) => {
    e.preventDefault();
    //fixBUG:bid is async, sometimes bid_money is empty and bid_pre is executed!
    //add ref in input label
    let bid_money = this.state.price;
    console.log(bid_money);
    try {
      let res = await auctionInstance.methods.bid(term.auction_ID).send({
        from: this.state.account,
        value: web3.utils.toWei(String(bid_money), "ether"),
        gas: "3000000",
      });
      console.log(res);
      alert("bid success");
      this.resetAll();
      await this.loadBlockchainData();
      this.setState({ isShowNFTMarket: true });
    } catch (e) {
      console.log(e);
      alert("bid fail!");
    }
  };

  endAuction = async (term) => {
    try {
      await auctionInstance.methods
        .endAuction(term.auction_ID)
        .send({ from: this.state.account, gas: "3000000" });
      alert("claim NFT success");
      this.resetAll();
      await this.loadBlockchainData();
      this.setState({ isShowNFTMarket: true });
    } catch (e) {
      console.log(e);
      alert("claim NFT fail!");
    }
  };

  showHistory = (term) => {
    this.resetAll();
    this.setState({ isShowHistory: true, history: term.History });
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
        History: this.state.NFTHistory[this.state.showMarketNFT_auctionIDs[i]],
      });
    }
    console.log(res);
    return res ? (
      <div>
        {res.map((term) => (
          <div>
            {!term.is_ended ? (
              <div>
                <p>
                  起价: {web3.utils.fromWei(term.start_price, "ether")} ether{" "}
                  <br />
                  最高价: {web3.utils.fromWei(term.highest_price, "ether")}{" "}
                  ether
                </p>
                <p>结束时间: {new Date(term.end_time * 1000).toString()}</p>
                <p>{term.is_ended ? "已结束" : "未结束"}</p>
                <Button onClick={this.showHistory.bind(this, term)}>
                  流转信息
                </Button>
                <img
                  style={{ height: 180, width: 320 }}
                  alt="NFT"
                  src={"http://localhost:8080/ipfs/" + term.URI}
                />
                <form onSubmit={this.bid.bind(this, term)}>
                  <label>
                    出价:
                    <input
                      id="price"
                      type="number"
                      step="0.000000000000000001"
                      name="price"
                      onChange={this.handleChange}
                      ref={(input) => {
                        this.bid_money = input;
                      }}
                    />
                  </label>
                  <input type="submit" value="确认参与" />
                </form>
                <Button onClick={this.endAuction.bind(this, term)}>
                  认领NFT
                </Button>
                <Divider />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    ) : null;
  };

  showBoughtNFT = () => {
    let res = [];
    for (let i = 0; i < this.state.showBuyNFT_URI.length; i++) {
      res.push({
        price: this.state.showBuyNFT_price[i],
        URI: this.state.showBuyNFT_URI[i],
      });
    }
    console.log(res);
    return (
      <div>
        {res.map((term) => (
          <div>
            <p>买入价格: {web3.utils.fromWei(term.price, "ether")} ether</p>
            <img
              style={{ height: 180, width: 320 }}
              alt="NFT"
              src={"http://localhost:8080/ipfs/" + term.URI}
            />
            <Divider />
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div class="topMenu">
        <Home account={this.state.account} />
        <div>
          <div align="center">
            <Menu theme="light" mode="horizontal" style={{ width: 900 }}>
              <Menu.Item>
                <Button
                  icon={<HomeOutlined />}
                  value="large"
                  type="primary"
                  onClick={() => {
                    this.resetAll();
                    console.log("click Mint NFT");
                    this.setState({ isShowMintNFT: true });
                  }}
                >
                  铸造NFT
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button
                  icon={<SettingFilled />}
                  value="large"
                  type="primary"
                  onClick={() => {
                    this.resetAll();
                    console.log("click showMyNFT");
                    this.setState({ isShowMyNFT: true });
                  }}
                >
                  我拥有的NFT
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button
                  icon={<SendOutlined />}
                  value="large"
                  type="primary"
                  onClick={() => {
                    this.resetAll();
                    console.log("click showMyOngingNFT");
                    this.setState({ isShowMyOngoingNFT: true });
                  }}
                >
                  我的NFT拍卖详情
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button
                  icon={<ShopOutlined />}
                  value="large"
                  type="primary"
                  onClick={() => {
                    this.resetAll();
                    console.log("click show NFT market");
                    this.setState({ isShowNFTMarket: true });
                  }}
                >
                  NFT市场
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button
                  icon={<StarOutlined />}
                  value="large"
                  type="primary"
                  onClick={() => {
                    this.resetAll();
                    console.log("click bought NFT");
                    this.setState({ isShowBuyNFT: true });
                  }}
                >
                  我买入的NFT
                </Button>
              </Menu.Item>
            </Menu>
            <Divider />

            <BackTop />
            {/* 下面是铸造NFT界面的内容 */}
            <div>
              {this.state.isShowMintNFT ? (
                <div>
                  <div>
                    <label id="file"></label>
                    <input
                      type="file"
                      ref="file"
                      id="file"
                      name="file"
                      multiple="multiple"
                    />
                  </div>
                  <Divider />
                  <Button
                    spin
                    icon={<UploadOutlined />}
                    value="large"
                    style={{ color: "black" }}
                    type="primary"
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
                  </Button>
                  <Divider />
                  <Button
                    icon={<SketchOutlined spin />}
                    type="primary"
                    style={{ color: "pink" }}
                    onClick={this.mintNFT}
                  >
                    mint
                  </Button>
                  <Divider />
                  {this.state.imgSrc ? (
                    <div>
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
                    <div>
                      <h3>please upload your NFT image</h3>
                    </div>
                  )}
                </div>
              ) : null}
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
            {/* 下面是NFT流转信息的内容 */}
            <div>
              {this.state.isShowHistory
                ? this.state.history.map((history) => <p>{history}</p>)
                : null}
            </div>
            {/* 下面是买入NFT的内容 */}
            <div>{this.state.isShowBuyNFT ? this.showBoughtNFT() : null}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
