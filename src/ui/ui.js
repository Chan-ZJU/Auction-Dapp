import React from "react";
import { Card, BackTop, Comment, Avatar } from "antd";
import { SoundOutlined } from "@ant-design/icons";

const Home = (props) => (
  <div align="center">
    <BackTop />
    <Card
      icon={<SoundOutlined />}
      title="CZ's NFT Market"
      style={{ width: 600, height: 60 }}
      align="center"
      href="https://github.com/Chan-ZJU/Auction-Dapp"
    />
    <Comment
      href="https://github.com/Chan-ZJU"
      style={{ width: 500 }}
      author={<a href="https://github.com/Chan-ZJU">Chan-ZJU</a>}
      avatar={
        <Avatar
          size="large"
          src="https://joeschmoe.io/api/v1/random"
          href="https://github.com/Chan-ZJU"
        />
      }
      datetime={"2021-11-5"}
      content={
        <div>
          <p>当前账户地址: {props.account}</p>
          <p>当前账户余额: {props.balance} ETH</p>
        </div>
      }
    ></Comment>
  </div>
);

export default Home;
